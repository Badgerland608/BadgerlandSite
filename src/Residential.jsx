
import React from "react";
import { Link } from "react-router-dom";

export default function Residential() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16 text-gray-800">

      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-5">
          Residential Laundry Pickup & Delivery
        </h1>

        <p className="text-lg leading-relaxed max-w-3xl">
          Laundry doesn't have to take over your week. Badgerland Laundry
          provides convenient wash-and-fold pickup and delivery for households
          in Sun Prairie, Madison, and surrounding communities.
        </p>
      </section>

      <section className="bg-purple-50 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-purple-900 mb-3">
          Straightforward Residential Pricing
        </h2>

        <p className="text-4xl font-bold text-purple-800 mb-2">
          $1.60 <span className="text-lg font-medium">per pound</span>
        </p>

        <p className="text-gray-700 mb-5">
          $24 minimum order
        </p>

        <p className="leading-relaxed">
          Your laundry is washed, dried, neatly folded, and returned to you
          through our pickup and delivery service.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <div>
          <h3 className="font-bold text-purple-900 text-lg mb-2">
            1. Schedule Pickup
          </h3>
          <p>
            Arrange a pickup and have your laundry ready in your designated
            collection bag.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-purple-900 text-lg mb-2">
            2. We Wash & Fold
          </h3>
          <p>
            We take care of the washing, drying, and folding.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-purple-900 text-lg mb-2">
            3. Delivery
          </h3>
          <p>
            Your clean, folded laundry is returned to your home.
          </p>
        </div>
      </section>

      <section className="text-center bg-purple-900 text-white rounded-xl p-4">
        <h2 className="text-2xl font-bold mb-2">
          Ready to Skip Laundry Day?
        </h2>

        <p className="mb-6 text-purple-100">
          Let Badgerland Laundry handle the washing and folding.
        </p>

        <Link
          to="/plans"
          className="inline-block bg-white text-purple-900 font-semibold px-6 py-3 rounded-full hover:bg-purple-100 transition"
        >
          View Residential Plans
        </Link>
      </section>

    </main>
  );
}
