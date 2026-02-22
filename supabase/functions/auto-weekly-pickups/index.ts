import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

/* ============================================================
   Helper: Get next occurrence of a weekday with offset
============================================================ */
function getNextDate(dayName: string, offsetDays = 0) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const targetIndex = days.indexOf(dayName);
  if (targetIndex === -1) return null;

  const today = new Date();
  const result = new Date();

  const diff = (targetIndex + 7 - today.getDay()) % 7;
  result.setDate(today.getDate() + (diff === 0 ? 7 : diff) + offsetDays);

  return result.toISOString().split("T")[0];
}

/* ============================================================
   Helper: Monthly cadence — next same weekday next month
============================================================ */
function getNextMonthlyDate(dayName: string) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const targetIndex = days.indexOf(dayName);
  if (targetIndex === -1) return null;

  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Find first occurrence of the target weekday in next month
  while (nextMonth.getDay() !== targetIndex) {
    nextMonth.setDate(nextMonth.getDate() + 1);
  }

  return nextMonth.toISOString().split("T")[0];
}

/* ============================================================
   Determine cadence based on plan
============================================================ */
function getCadence(planName: string) {
  if (planName === "Ultra Household Plan") return "weekly";
  if (planName === "Household Plan") return "weekly";
  if (planName === "Family Plan") return "biweekly";
  if (planName === "Single/Student Plan") return "monthly";
  return "manual";
}

Deno.serve(async () => {
  console.log("➡️ Running automation...");

  // 1. Get all active subscribers with preferences
  const { data: subs, error: subErr } = await supabase
    .from("subscriptions")
    .select("*, user_id")
    .eq("active", true)
    .not("pickup_day", "is", null)
    .not("pickup_time", "is", null);

  if (subErr) {
    console.error("❌ Error loading subscriptions:", subErr);
    return new Response("Error", { status: 500 });
  }

  if (!subs || subs.length === 0) {
    console.log("ℹ️ No subscribers with preferences.");
    return new Response("OK", { status: 200 });
  }

  for (const sub of subs) {
    const cadence = getCadence(sub.plan_name);

    if (cadence === "manual") {
      console.log(`⏭️ Skipping manual plan for user ${sub.user_id}`);
      continue;
    }

    let nextDate;

    if (cadence === "weekly") {
      nextDate = getNextDate(sub.pickup_day, 0);
    }

    if (cadence === "biweekly") {
      nextDate = getNextDate(sub.pickup_day, 14);
    }

    if (cadence === "monthly") {
      nextDate = getNextMonthlyDate(sub.pickup_day);
    }

    if (!nextDate) continue;

    // 2. Avoid duplicates
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", sub.user_id)
      .eq("pickup_date", nextDate)
      .eq("pickup_time", sub.pickup_time)
      .maybeSingle();

    if (existing) {
      console.log(`⏭️ Duplicate skipped for user ${sub.user_id}`);
      continue;
    }

    // 3. Create the scheduled pickup
    const { error: orderErr } = await supabase.from("orders").insert({
      user_id: sub.user_id,
      pickup_date: nextDate,
      pickup_time: sub.pickup_time,
      status: "scheduled",
      service: "subscriber",
      pounds: 0,
      total_price: 0
    });

    if (orderErr) {
      console.error("❌ Error creating order:", orderErr);
      continue;
    }

    console.log(`✅ ${cadence} pickup created for user ${sub.user_id} on ${nextDate}`);

    // 4. Notify user
    await supabase.from("notifications").insert({
      user_id: sub.user_id,
      type: "auto_pickup",
      message: `Your ${cadence} pickup has been scheduled for ${nextDate} at ${sub.pickup_time}.`
    });
  }

  return new Response("OK", { status: 200 });
});
