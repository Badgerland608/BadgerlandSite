import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { order_id, status } = await req.json();

    if (!order_id || !status) {
      return new Response(
        JSON.stringify({ error: "order_id and status are required" }),
        { status: 400 }
      );
    }

    // 1) Fetch the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.error("Order fetch error:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    // 2) Build a message based on status
    let subject = "";
    let message = "";

    switch (status) {
      case "picked_up":
        subject = "Your laundry has been picked up";
        message = `Hi ${order.full_name}, your Badgerland Laundry pickup is complete and your laundry is on its way to be washed.`;
        break;

      case "washing":
        subject = "Your laundry is being washed";
        message = `Hi ${order.full_name}, your laundry is now being washed and processed.`;
        break;

      case "ready":
        subject = "Your laundry is ready for delivery";
        message = `Hi ${order.full_name}, your laundry is ready and will be delivered during your scheduled window.`;
        break;

      case "delivered":
        subject = "Your laundry has been delivered";
        message = `Hi ${order.full_name}, your laundry has been delivered. Thank you for choosing Badgerland Laundry!`;
        break;

      default:
        subject = "Update on your laundry order";
        message = `Hi ${order.full_name}, there is an update on your laundry order. Current status: ${status}.`;
        break;
    }

    // 3) Notification placeholder
    console.log(
      `Status update notification prepared for order ${order_id}: ${status}`
    );
    console.log("Message:", message);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

  } catch (err) {
    console.error("order-status-update error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
});