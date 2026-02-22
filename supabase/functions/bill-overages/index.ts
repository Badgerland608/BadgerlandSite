import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@12.18.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

/* ============================================================
   Helper: Get start of current billing cycle (1st of month)
============================================================ */
function getCycleStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

Deno.serve(async () => {
  console.log("➡️ Running monthly overage billing...");

  // 1. Get all active subscribers
  const { data: subs, error: subErr } = await supabase
    .from("subscriptions")
    .select("*, user_id")
    .eq("active", true);

  if (subErr) {
    console.error("❌ Error loading subscriptions:", subErr);
    return new Response("Error", { status: 500 });
  }

  const cycleStart = getCycleStart();

  for (const sub of subs) {
    console.log(`➡️ Checking overages for user ${sub.user_id}`);

    // 2. Load all orders for this user in the current cycle
    const { data: orders, error: orderErr } = await supabase
      .from("orders")
      .select("pounds")
      .eq("user_id", sub.user_id)
      .gte("created_at", cycleStart);

    if (orderErr) {
      console.error("❌ Error loading orders:", orderErr);
      continue;
    }

    const totalUsed = (orders || []).reduce(
      (sum, o) => sum + (o.pounds || 0),
      0
    );

    const included = sub.included_lbs || 0;
    const extraRate = sub.extra_rate || 0;

    const overageLbs = Math.max(totalUsed - included, 0);
    const overageAmount = overageLbs * extraRate;

    if (overageAmount <= 0) {
      console.log(`✔ No overage for user ${sub.user_id}`);
      continue;
    }

    console.log(
      `⚠️ User ${sub.user_id} used ${totalUsed} lbs, overage = ${overageLbs} lbs`
    );

    // 3. Create Stripe invoice item
    try {
      await stripe.invoiceItems.create({
        customer: sub.stripe_customer_id,
        amount: Math.round(overageAmount * 100), // convert to cents
        currency: "usd",
        description: `Laundry overage: ${overageLbs} lbs @ $${extraRate}/lb`,
      });

      console.log(`💰 Overage billed for user ${sub.user_id}`);
    } catch (err) {
      console.error("❌ Stripe billing error:", err);
      continue;
    }

    // 4. Optional: notify user
    await supabase.from("notifications").insert({
      user_id: sub.user_id,
      type: "overage_charge",
      message: `You were billed $${overageAmount.toFixed(
        2
      )} for ${overageLbs} lbs of overage.`,
    });
  }

  return new Response("OK", { status: 200 });
});