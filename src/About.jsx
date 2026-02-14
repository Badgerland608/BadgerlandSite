// src/pages/About.jsx

import React from 'react';

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-purple-900">

      {/* Header */}
      <h1 className="text-3xl font-bold text-purple-800 mb-4 text-center">
        About Badgerland Laundry
      </h1>

      <p className="text-lg text-center mb-10 text-purple-700 leading-relaxed">
        Built on community, consistency, and care — proudly serving Wisconsin families with
        convenient pickup & delivery laundry service.
      </p>

      {/* Our Story */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-800 mb-3">Our Story</h2>
        <p className="leading-relaxed">
          Badgerland Laundry started with a simple mission: make laundry day easier for busy
          Wisconsin households. What began as a small pickup-and-delivery service has grown into
          a trusted local operation serving homes, apartments, and small businesses across the
          region.
        </p>
        <p className="leading-relaxed mt-3">
          We believe laundry shouldn’t steal your time. Whether you're juggling work, family,
          school, or all three — we’re here to lighten the load.
        </p>
      </section>

      {/* What We Stand For */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-800 mb-3">What We Stand For</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Reliability:</strong> On-time pickups, fast turnaround, and consistent quality.
          </li>
          <li>
            <strong>Transparency:</strong> Clear pricing, no hidden fees, and honest communication.
          </li>
          <li>
            <strong>Community:</strong> We’re a Wisconsin-built service supporting local families.
          </li>
          <li>
            <strong>Care:</strong> Every load is handled with the same attention we’d give our own.
          </li>
        </ul>
      </section>

      {/* Why We're Different */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-800 mb-3">Why We’re Different</h2>
        <p className="leading-relaxed">
          We don’t believe laundry should be complicated. That’s why we offer simple pricing,
          subscription options for families who want to save, and a smooth online experience from
          scheduling to delivery.
        </p>
        <p className="leading-relaxed mt-3">
          When you choose Badgerland Laundry, you’re choosing a local business that values your
          time, your clothes, and your trust.
        </p>
      </section>

      {/* CTA */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-purple-800 mb-4">
          Ready to Experience Laundry Freedom?
        </h2>
        <a
          href="/plans"
          className="bg-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-purple-600 transition"
        >
          View Subscription Plans
        </a>
      </div>

    </div>
  );
}

export default About;