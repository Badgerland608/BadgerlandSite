import React from 'react';

function WhyChooseUs() {
  return (
    <section className="bg-white py-20 text-center">
      <h3 className="text-3xl font-bold text-purple-900 mb-12">
        Why Choose Badgerland Laundry
      </h3>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {[
          "Locally owned and operated in Dane County",
          "Fast turnaround with next‑day delivery",
          "Reliable pickup & drop‑off",
          "Clean, professional packaging",
          "Premium detergents with hypoallergenic options",
          "Secure handling of your laundry",
          "Friendly, responsive customer service",
          "Affordable, transparent pricing"
        ].map((item) => (
          <div
            key={item}
            className="bg-purple-50 rounded-xl shadow-md p-6 text-gray-700 text-lg font-medium"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
