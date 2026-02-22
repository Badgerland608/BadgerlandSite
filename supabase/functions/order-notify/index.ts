import { serve } from "https://deno.land/std/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = [
  "https://www.badgerlandlaundry.com",
  "https://badgerlandsite.pages.dev"
];

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const body = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: body.user_id || null,
      full_name: body.full_name,
      address: body.address,
      phone: body.phone,
      email: body.email,
      pickup_date: body.pickup_date,
      pickup_time: body.pickup_time,
      notification_preference: body.notification_preference,
      detergent: body.detergent,
      dryer_sheets: body.dryer_sheets,
      instructions: body.instructions,
      service: body.service,
      bags: body.bags,
      estimate: body.estimate,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    console.error("DB error:", error);
    return new Response(JSON.stringify({ error }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

  await resend.emails.send({
    from: "Badgerland Laundry LLC <no-reply@badgerlandlaundry.com>",
    to: "info@badgerlandlaundry.com",
    subject: "New Laundry Pickup Scheduled",
    html: `
      <h2>New Pickup Request</h2>

      <p><strong>Name:</strong> ${body.full_name}</p>
      <p><strong>Address:</strong> ${body.address}</p>
      <p><strong>Phone:</strong> ${body.phone}</p>
      <p><strong>Email:</strong> ${body.email}</p>

      <p><strong>Pickup:</strong> ${body.pickup_date} at ${body.pickup_time}</p>

      <p><strong>Service:</strong> ${body.service}</p>
      <p><strong>Detergent:</strong> ${body.detergent}</p>
      <p><strong>Dryer Sheets:</strong> ${body.dryer_sheets}</p>

      <p><strong>Bags/Loads:</strong> ${body.bags}</p>
      <p><strong>Estimated Cost:</strong> $${body.estimate}</p>

      <p><strong>Instructions:</strong> ${body.instructions}</p>
    `
  });

  if (body.notification_preference === "email" || body.notification_preference === "both") {
    await resend.emails.send({
      from: "Badgerland Laundry <no-reply@badgerlandlaundry.com>",
      to: body.email,
      subject: "Your Pickup is Scheduled",
      html: `
        <h2>Thanks for scheduling with Badgerland Laundry!</h2>

        <p>Your pickup is scheduled for:</p>
        <p><strong>${body.pickup_date}</strong> at <strong>${body.pickup_time}</strong></p>

        <p><strong>Bags/Loads:</strong> ${body.bags}</p>
        <p><strong>Estimated Cost:</strong> $${body.estimate}</p>

        <p>We’ll notify you when your laundry is being washed and when it’s out for delivery.</p>
      `
    });
  }

  return new Response(JSON.stringify({ success: true, order: data }), {
    status: 200,
    headers: corsHeaders
  });
});