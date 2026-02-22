// supabase/functions/order-status-notify/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import twilio from "https://esm.sh/twilio@4.19.0";

serve(async (req) => {
  try {
    const payload = await req.json();

    // Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const record = payload.record;
    const orderId = record.order_id;

    // Fetch order + user info
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*, profiles(*), notification_settings(*)")
      .eq("id", orderId)
      .single();

    if (orderErr) throw orderErr;

    const customer = order.profiles;
    const notify = order.notification_settings;

    const newStatus = record.new_status.replace(/_/g, " ");

    // -------------------------
    // EMAIL (Resend)
    // -------------------------
    if (notify?.email_enabled && customer?.email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Badgerland Laundry <no-reply@yourdomain.com>",
          to: customer.email,
          subject: `Your laundry order is now ${newStatus}`,
          html: `
            <p>Hi ${customer.full_name || "there"},</p>
            <p>Your laundry order has been updated to: <strong>${newStatus}</strong>.</p>
            <p>Thank you for choosing Badgerland Laundry!</p>
          `,
        }),
      });
    }

    // -------------------------
    // SMS (Twilio)
    // -------------------------
    if (notify?.sms_enabled && notify?.phone) {
      const client = twilio(
        Deno.env.get("TWILIO_SID")!,
        Deno.env.get("TWILIO_AUTH_TOKEN")!
      );

      await client.messages.create({
        body: `Badgerland Laundry: Your order is now ${newStatus}.`,
        from: Deno.env.get("TWILIO_PHONE_NUMBER")!,
        to: notify.phone,
      });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Error in order-status-notify:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
