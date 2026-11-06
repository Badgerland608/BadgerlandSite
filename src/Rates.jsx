
import React from 'react';
import { Link } from 'react-router-dom';

function Rates() {
  return (
    <section className="bg-white py-16 px-4 text-center">
      <div className="max-w-5xl mx-auto">

        <p className="text-purple-700 font-bold uppercase tracking-widest text-sm mb-3">
          Straightforward Service
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
          Laundry Service & Pricing
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          Whether you need help at home or dependable laundry support
          for your business, we have a service option for you.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">

          {/* Residential */}
          <div className="bg-purple-50 rounded-2xl border border-purple-100 shadow-sm p-8">
            <h3 className="text-purple-900 font-bold text-2xl mb-6">
              Residential Wash & Fold
            </h3>

            <div className="space-y-5 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Wash & Fold</p>
                <p className="text-3xl font-bold text-purple-900">
                  $1.60<span className="text-base font-medium">/lb</span>
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Minimum Order</p>
                <p className="text-xl font-bold text-purple-900">$24</p>
              </div>

              <p className="font-medium text-purple-800">
                Convenient pickup and delivery
              </p>
            </div>

            <Link
              to="/residential"
              className="mt-8 inline-block bg-purple-800 text-white px-7 py-3 rounded-full font-semibold hover:bg-purple-900 transition"
            >
              Residential Service
            </Link>
          </div>

          {/* Commercial */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-purple-900 font-bold text-2xl mb-6">
              Commercial Laundry
            </h3>

            <div className="space-y-5 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Pricing</p>
                <p className="text-2xl font-bold text-purple-900">
                  Custom Quotes
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Service Options</p>
                <p className="font-medium">
                  Towels, linens, bedding, and uniforms
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Scheduling</p>
                <p className="font-medium">
                  Recurring or as-needed pickup
                </p>
              </div>

              <p className="font-medium text-purple-800">
                Businesses of all sizes welcome
              </p>
            </div>

            <Link
              to="/commercial"
              className="mt-8 inline-block bg-purple-800 text-white px-7 py-3 rounded-full font-semibold hover:bg-purple-900 transition"
            >
              Request a Commercial Quote
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Rates;
