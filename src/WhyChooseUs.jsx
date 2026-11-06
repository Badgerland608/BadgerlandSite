
import React from 'react';

function WhyChooseUs() {
  const benefits = [
    {
      title: "Locally Owned & Operated",
      description:
        "Work with a local laundry service that understands the needs of businesses and households in the Dane County area."
    },
    {
      title: "Convenient Pickup & Delivery",
      description:
        "We handle the transportation so you don't have to spend time bringing laundry to a laundromat."
    },
    {
      title: "Flexible Service Options",
      description:
        "From recurring business pickups to occasional laundry needs, we'll discuss a schedule that works for you."
    },
    {
      title: "Careful Laundry Handling",
      description:
        "Your laundry is washed, dried, folded, and packaged neatly before being returned."
    },
    {
      title: "Business & Household Service",
      description:
        "We work with local businesses while continuing to provide convenient wash-and-fold service for households."
    },
    {
      title: "Straightforward Pricing",
      description:
        "Residential pricing is easy to understand, while commercial customers can request a quote based on their needs."
    }
  ];

  return (
    <section className="bg-white py-20 px-4 text-center">
      <div className="max-w-5xl mx-auto">

        <p className="text-purple-700 font-bold uppercase tracking-widest text-sm mb-3">
          The Badgerland Difference
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-5">
          Why Choose Badgerland Laundry?
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          More convenience, less time managing laundry, and a local
          service focused on making your day easier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-purple-50 rounded-2xl border border-purple-100 p-7 text-left"
            >
              <h3 className="text-xl font-bold text-purple-900 mb-3">
                {benefit.title}
              </h3>

              <p className="text-gray-700 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;
