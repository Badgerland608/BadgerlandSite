
import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Commercial() {
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    business_type: "",
    business_city: "",
    business_zip: "",
    estimated_weekly_volume: "",pickup_frequency: "",
preferred_start_date: "",
    services_needed: [],
    additional_details: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const services = [
    "Towels",
    "Sheets & bedding",
    "Linens",
    "Blankets",
    "Uniforms",
    "Other",
  ];

  function updateField(e) {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function toggleService(service) {
    setForm((previous) => ({
      ...previous,
      services_needed: previous.services_needed.includes(service)
        ? previous.services_needed.filter((item) => item !== service)
        : [...previous.services_needed, service],
    }));
  }

  
async function handleSubmit(e) {
  e.preventDefault();
  setSubmitting(true);
  setMessage("");

  const { data, error } = await supabase.functions.invoke(
    "commercial-inquiry-notify",
    {
      body: form,
    }
  );

  setSubmitting(false);

  if (error) {
    console.error("Commercial inquiry error:", error);
    setMessage("We couldn't submit your request. Please try again.");
    return;
  }

  if (!data?.success) {
    setMessage("Your request couldn't be processed. Please try again.");
    return;
  }

  setMessage(
    data.admin_email_sent && data.customer_email_sent
      ? "Thank you! Your request was received. Check your email for confirmation."
      : "Your request was received, but an email notification may have failed. We'll follow up."
  );

  setForm({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    business_type: "",
    business_city: "",
    business_zip: "",
    estimated_weekly_volume: "",
    services_needed: [],
    additional_details: "",
    pickup_frequency: "",
    preferred_start_date: "",
  });
}


  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-700 focus:outline-none";

  return (
    <main className="text-gray-800">
      <section className="bg-purple-950 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 font-semibold uppercase tracking-widest text-purple-200">
            Badgerland Laundry Commercial Services
          </p>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Laundry Support That Keeps Your Business Moving
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-purple-100">
            Spend less time managing laundry and more time running your
            business. Badgerland Laundry provides convenient pickup and
            delivery laundry service for businesses throughout our service
            area.
          </p>
          <a
            href="#commercial-quote"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-purple-950 transition hover:bg-purple-100"
          >
            Request a Commercial Quote
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold text-purple-900">
          Commercial Laundry for Local Businesses
        </h2>
        <p className="mx-auto mb-10 max-w-3xl text-center leading-relaxed text-gray-600">
          Whether your business goes through a steady supply of towels,
          bedding, linens, or uniforms, we're interested in helping simplify
          your laundry routine.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Gyms & Fitness Centers",
              description: "Towels and other regularly used laundry.",
            },
            {
              title: "Spas & Salons",
              description: "Towels, linens, and service-related laundry.",
            },
            {
              title: "Pet Boarding Businesses",
              description: "Bedding, towels, and washable items.",
            },
            {
              title: "Resorts & Lodging",
              description: "Sheets, towels, blankets, and linens.",
            },
            {
              title: "Vacation Rentals",
              description: "Guest bedding, towels, and household linens.",
            },
            {
              title: "Other Local Businesses",
              description: "Tell us what your business needs washed.",
            },
          ].map((industry) => (
            <div
              key={industry.title}
              className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-xl font-bold text-purple-900">
                {industry.title}
              </h3>
              <p className="text-gray-600">{industry.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-purple-50 px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
          

<div>
  <h2 className="mb-5 text-3xl font-bold text-purple-900">
    We Pick Up. We Clean. We Deliver.
  </h2>

  <p className="mb-6 leading-relaxed text-gray-600">
    Your business doesn't need to spend time transporting laundry.
    Badgerland Laundry handles pickup and delivery so your team
    can focus on running your business.
  </p>

  <div className="space-y-5">
    {[
      [
        "1. We Pick Up",
        "We collect your business laundry on an agreed schedule."
      ],
      [
        "2. We Handle the Laundry",
        "Your towels, linens, bedding, and uniforms are washed, dried, and folded."
      ],
      [
        "3. We Deliver It Back",
        "Your clean, folded laundry is returned to your business."
      ],
    ].map(([title, description]) => (
      <div key={title}>
        <h3 className="font-bold text-purple-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    ))}
  </div>

  <div className="mt-7 rounded-xl bg-purple-100 p-5">
    <h3 className="mb-2 font-bold text-purple-900">
      Convenient Business Pickup & Delivery
    </h3>
    <p className="text-sm leading-relaxed text-gray-700">
      Serving Madison, Sun Prairie, and surrounding Dane County
      communities. Pickup and delivery only — no public drop-off
      required.
    </p>
  </div>
</div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-purple-900">
              Straightforward Pricing
            </h2>
            <p className="mb-2 text-4xl font-bold text-purple-900">
              $1.60<span className="text-lg font-medium"> / lb</span>
            </p>
            <p className="mb-5 text-gray-600">
              15-pound minimum order — starting at $24.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Recurring commercial accounts and larger laundry volumes can
              request a custom quote. Final pricing and pickup arrangements
              are confirmed before service begins.
            </p>
          </div>
        </div>
      </section>

      <section
        id="commercial-quote"
        className="mx-auto max-w-3xl px-6 py-16"
      >
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold text-purple-900">
            Request a Commercial Quote
          </h2>
          <p className="text-gray-600">
            Tell us a little about your business and its laundry needs.
            We'll follow up to discuss the details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div>
            <label className="mb-2 block font-semibold">Business Name *</label>
            <input
              className={inputClass}
              name="business_name"
              value={form.business_name}
              onChange={updateField}
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Contact Name *</label>
            <input
              className={inputClass}
              name="contact_name"
              value={form.contact_name}
              onChange={updateField}
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">Email *</label>
              <input
                className={inputClass}
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                required
              />
            </div>
            <div>
              <label className="mb-2 block font-semibold">Phone (Optional)</label>
              <input
                className={inputClass}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateField}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Business Type *</label>
            <select
              className={inputClass}
              name="business_type"
              value={form.business_type}
              onChange={updateField}
              required
            >
              <option value="">Select your business type</option>
              <option value="Gym / Fitness Center">Gym / Fitness Center</option>
              <option value="Spa / Salon">Spa / Salon</option>
              <option value="Pet Boarding">Pet Boarding</option>
              <option value="Resort / Lodging">Resort / Lodging</option>
              <option value="Vacation Rental">Vacation Rental</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
  <div>
  <label className="mb-2 block font-semibold">
    Business City *
  </label>
  <input
    className={inputClass}
    type="text"
    name="business_city"
    value={form.business_city}
    onChange={updateField}
    placeholder="Example: Sun Prairie"
    required
  />
</div>

<div>
  <label className="mb-2 block font-semibold">
    Business ZIP Code *
  </label>
  <input
    className={inputClass}
    type="text"
    name="business_zip"
    value={form.business_zip}
    onChange={updateField}
    placeholder="5-digit ZIP code"
    maxLength={5}
    pattern="[0-9]{5}"
    inputMode="numeric"
    required
  />
</div>


          <div>
            <label className="mb-2 block font-semibold">
              Estimated Weekly Laundry Volume
            </label>
            <select
              className={inputClass}
              name="estimated_weekly_volume"
              value={form.estimated_weekly_volume}
              onChange={updateField}
            >
              <option value="">Not sure yet</option>
              <option value="Under 50 lbs">Under 50 lbs</option>
              <option value="50–100 lbs">50–100 lbs</option>
              <option value="101–250 lbs">101–250 lbs</option>
              <option value="251–500 lbs">251–500 lbs</option>
              <option value="Over 500 lbs">Over 500 lbs</option>
            </select>
          </div>
          <div>
  <label className="mb-2 block font-semibold">
    How Often Do You Need Pickup?
  </label>
  <select
    className={inputClass}
    name="pickup_frequency"
    value={form.pickup_frequency}
    onChange={updateField}
  >
    <option value="">Select pickup frequency</option>
    <option value="Twice weekly">Twice weekly</option>
    <option value="Weekly">Weekly</option>
    <option value="Every other week">Every other week</option>
    <option value="Monthly">Monthly</option>
    <option value="As needed">As needed</option>
    <option value="Not sure yet">Not sure yet</option>
  </select>
</div>

<div>
  <label className="mb-2 block font-semibold">
    Preferred Service Start Date
  </label>
  <input
    className={inputClass}
    type="date"
    name="preferred_start_date"
    value={form.preferred_start_date}
    onChange={updateField}
  />
</div>

          <fieldset>
            <legend className="mb-3 font-semibold">What needs washing?</legend>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <label key={service} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.services_needed.includes(service)}
                    onChange={() => toggleService(service)}
                    className="h-4 w-4 accent-purple-800"
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="mb-2 block font-semibold">
              Tell Us More About Your Needs
            </label>
            <textarea
              className={inputClass}
              name="additional_details"
              value={form.additional_details}
              onChange={updateField}
              rows="4"
              placeholder="Pickup frequency, location, special requirements, or anything else we should know..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-purple-900 px-8 py-4 font-bold text-white transition hover:bg-purple-800 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Quote Request"}
          </button>

          {message && (
            <p role="status" className="text-center font-medium text-purple-900">
              {message}
            </p>
          )}

          <p className="text-center text-xs text-gray-500">
            Submitting this form does not schedule a pickup or commit your
            business to service.
          </p>
        </form>
      </section>
    </main>
  );
}
