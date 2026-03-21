import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = [
  "https://www.badgerlandlaundry.com",
  "https://badgerlandsite.pages.dev",
  "http://localhost:3000" 
];

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // 1. Handle Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 2. GET STRIPE ID FROM PROFILE (If user_id exists)
    let stripeId = null;
    if (body.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', body.user_id)
        .single();
      stripeId = profile?.stripe_customer_id || null;
    }

    // 3. INSERT ORDER (Updated to match your SQL schema)
    const { data, error: dbError } = await supabase
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
        dryer_sheets: body.dryer_sheets === "yes" || body.dryer_sheets === true, // Convert to boolean
        instructions: body.instructions,
        service: body.service,
        bags: body.bags ? parseInt(body.bags) : 0,
        estimate: body.estimate ? parseFloat(body.estimate) : 0,
        status: "scheduled", // Changed from pending to match your workflow
        stripe_customer_id: stripeId, // THE MISSING LINK
        customer_name: body.full_name,
        customer_email: body.email
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 4. SEND NOTIFICATIONS
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // To Admin
    await resend.emails.send({
      from: "Badgerland Laundry LLC <no-reply@badgerlandlaundry.com>",
      to: "info@badgerlandlaundry.com",
      subject: `New Pickup: ${body.full_name}`,
      html: `<h2>New Pickup Request</h2>
             <p><strong>Name:</strong> ${body.full_name}</p>
             <p><strong>Pickup:</strong> ${body.pickup_date} at ${body.pickup_time}</p>
             <p><strong>Service:</strong> ${body.service}</p>`
    });

    // To Customer
    if (body.notification_preference === "email" || body.notification_preference === "both") {
      await resend.emails.send({
        from: "Badgerland Laundry <no-reply@badgerlandlaundry.com>",
        to: body.email,
        subject: "Your Pickup is Scheduled",
        html: `<h2>Thanks, ${body.full_name.split(' ')[0]}!</h2>
               <p>Your laundry pickup is confirmed for <strong>${body.pickup_date}</strong>.</p>`
      });
    }

    return new Response(JSON.stringify({ success: true, order: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Function Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});