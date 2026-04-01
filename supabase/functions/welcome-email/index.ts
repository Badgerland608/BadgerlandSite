import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // This extracts the data sent by the Database Webhook
  const { record } = await req.json()

  // 1. Safety check: make sure we have an email
  if (!record.email) {
    return new Response("No email found in record", { status: 400 })
  }

  // 2. Send the request to Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Badgerland Laundry <updates@your-verified-domain.com>', // Use your Resend domain!
      to: [record.email],
      subject: 'Welcome to Badgerland Laundry!',
      html: `
        <h1>Welcome, ${record.full_name || 'Customer'}!</h1>
        <p>Thanks for creating an account with Badgerland Laundry.</p>
        <p>You can now log in to schedule your first pickup and view our subscription plans.</p>
        <br />
        <p>Best,<br />The Badgerland Team</p>
      `,
    }),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), { 
    status: res.status, 
    headers: { 'Content-Type': 'application/json' } 
  })
})