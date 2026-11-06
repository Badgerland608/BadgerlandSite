
import React from 'react';
import pickupImg from './assets/IMG_0917.jpg';

function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 px-4 text-center">
      <div className="max-w-5xl mx-auto">

        <p className="text-purple-700 font-bold uppercase tracking-widest text-sm mb-3">
          Simple & Convenient
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
          How Our Laundry Service Works
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          Whether you're running a business or managing laundry at home,
          we make getting clean laundry simple.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <div className="text-4xl mb-4">🚚</div>

            <p className="text-purple-600 font-bold text-sm uppercase mb-2">
              Step 1
            </p>

            <h3 className="text-xl font-bold text-purple-900 mb-3">
              We Pick Up
            </h3>

            <p className="text-gray-700 leading-relaxed">
              Schedule a convenient pickup. We'll collect your laundry
              directly from your home or business.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <img
              src={pickupImg}
              alt="Laundry being handled by Badgerland Laundry"
              className="h-48 w-full object-cover rounded-xl mb-5"
            />

            <p className="text-purple-600 font-bold text-sm uppercase mb-2">
              Step 2
            </p>

            <h3 className="text-xl font-bold text-purple-900 mb-3">
              We Clean & Fold
            </h3>

            <p className="text-gray-700 leading-relaxed">
              Your laundry is washed, dried, folded, and packaged
              neatly, ready to go back to you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <div className="text-4xl mb-4">🧺</div>

            <p className="text-purple-600 font-bold text-sm uppercase mb-2">
              Step 3
            </p>

            <h3 className="text-xl font-bold text-purple-900 mb-3">
              We Deliver
            </h3>

            <p className="text-gray-700 leading-relaxed">
              We return your clean, folded laundry directly to your
              home or business.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
