import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Load env vars safely
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Parse Stripe signature header
function parseStripeSignatureHeader(header: string) {
  const parts = header.split(",");
  let timestamp = "";
  const signatures: string[] = [];

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }

  return { timestamp, signatures };
}

// Verify signature using pure Deno crypto
async function verifyStripeSignature(payload: string, header: string, secret: string) {
  const { timestamp, signatures } = parseStripeSignatureHeader(header);

  if (!timestamp || signatures.length === 0) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = new TextEncoder().encode(secret);
  const data = new TextEncoder().encode(signedPayload);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);

  const expected = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return signatures.includes(expected);
}

// Main handler
Deno.serve(async (req) => {
  console.log("➡️ Webhook hit");

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    console.error("❌ Missing stripe-signature header");
    return new Response("Missing signature", { status: 400 });
  }

  const valid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);

  if (!valid) {
    console.error("❌ Invalid Stripe signature");
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("✅ Signature verified");

  const event = JSON.parse(body);
  console.log("➡️ Event:", event.type);

  /* ============================================================
     ⭐ NEW: HANDLE CHECKOUT SESSION COMPLETED
     This attaches the Supabase user_id to the subscription row.
  ============================================================ */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("➡️ checkout.session.completed received");

    if (!session.metadata?.user_id) {
      console.error("❌ No user_id found in metadata");
    } else {
      const userId = session.metadata.user_id;

      // Attach user_id to subscription row
      const { error } = await supabase
        .from("subscriptions")
        .update({
          user_id: userId
        })
        .eq("stripe_customer_id", session.customer);

      if (error) {
        console.error("❌ Failed to attach user_id:", error);
      } else {
        console.log("✅ Attached user_id to subscription:", userId);
      }

      // Optional: admin notification
      await supabase.from("notifications").insert({
        type: "new_subscription",
        user_id: userId,
        message: "A new user subscribed"
      });
    }
  }

  // ⭐ Subscription events
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object;

    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          plan_name: subscription.items.data[0].price.nickname,
          included_lbs: subscription.items.data[0].price.metadata.included_lbs,
          extra_rate: subscription.items.data[0].price.metadata.extra_rate,
          renewal_date: new Date(subscription.current_period_end * 1000)
            .toISOString()
            .split("T")[0],
          active: subscription.status === "active",
        },
        { onConflict: "stripe_customer_id" }
      );

    if (error) console.error("❌ DB upsert error:", error);
    else console.log("✅ Subscription upserted");
  }

  // ⭐ Cancellation
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    const { error } = await supabase
      .from("subscriptions")
      .update({ active: false })
      .eq("stripe_subscription_id", subscription.id);

    if (error) console.error("❌ DB update error:", error);
    else console.log("⚠️ Subscription marked inactive");
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});