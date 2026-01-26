import React from 'react';

function Rates() {
  return (
    <section className="bg-white py-14 text-center">
      <h3 className="text-3xl font-bold text-purple-900 mb-10">
        Rates
      </h3>

      <div className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto px-4">

        {/* Residential */}
        <div className="flex-1 min-w-[240px] max-w-md bg-purple-50 rounded-xl shadow-md p-8">
          <h4 className="text-purple-800 font-semibold text-xl mb-4">
            Residential
          </h4>

          <ul className="list-none text-gray-700 text-base space-y-3 leading-relaxed">
            <li>
              Wash & Fold: <strong className="text-purple-900">$1.60/lb</strong>
            </li>
            <li>
              Minimum Order: <strong className="text-purple-900">$24</strong>
            </li>
            <li className="text-purple-700 font-medium">
              Free Pickup & Next‑Day Delivery
            </li>
          </ul>
        </div>

        {/* Commercial */}
        <div className="flex-1 min-w-[240px] max-w-md bg-purple-50 rounded-xl shadow-md p-8">
          <h4 className="text-purple-800 font-semibold text-xl mb-4">
            Commercial
          </h4>

          <ul className="list-none text-gray-700 text-base space-y-3 leading-relaxed">
            <li>Custom Pricing</li>
            <li>Flexible Scheduling</li>
            <li className="text-purple-700 font-medium">
              Contact us for a quote
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}

export default Rates;
