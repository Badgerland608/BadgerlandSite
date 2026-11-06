
import React from 'react';

function FAQ() {
  const questions = [
    {
      q: "How does pickup and delivery work?",
      a: "We coordinate a pickup, collect your laundry from your home or business, wash, dry, and fold it, then arrange delivery back to you."
    },
    {
      q: "What types of businesses do you work with?",
      a: "We welcome inquiries from gyms, salons, spas, pet businesses, vacation rentals, hospitality providers, offices, and other local businesses."
    },
    {
      q: "Can my business schedule recurring pickups?",
      a: "Yes. We can discuss weekly, twice-weekly, every-other-week, monthly, or as-needed pickup arrangements based on your operation."
    },
    {
      q: "Is there a minimum weekly volume for businesses?",
      a: "No. Businesses of different sizes are welcome to request service. Contact us to discuss your laundry needs and pickup schedule."
    },
    {
      q: "How much does commercial laundry cost?",
      a: "Commercial pricing is based on your laundry needs and service requirements. Submit a commercial inquiry to request a quote."
    },
    {
      q: "What is the residential minimum order?",
      a: "Residential pickup and delivery has a $24 minimum order. Wash-and-fold service is $1.60 per pound."
    },
    {
      q: "What areas do you serve?",
      a: "Our service area includes Madison, Sun Prairie, Cottage Grove, DeForest, Windsor, Middleton, Fitchburg, Monona, Verona, McFarland, Stoughton, and Waunakee. Nearby businesses are welcome to inquire about service."
    },
    {
      q: "Do customers need to drop off their laundry?",
      a: "No. Badgerland Laundry operates with pickup and delivery. We collect and return laundry directly to your home or business."
    },
    {
      q: "What detergents do you use?",
      a: "We use quality laundry detergents, and hypoallergenic options are available upon request."
    }
  ];

  return (
    <section className="bg-gray-100 py-20 px-4">
      <div className="max-w-4xl mx-auto">

        <p className="text-purple-700 font-bold uppercase tracking-widest text-sm text-center mb-3">
          Need More Information?
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-5">
          {questions.map((item) => (
            <div
              key={item.q}
              className="bg-white shadow-sm border border-gray-100 rounded-xl p-6"
            >
              <h3 className="text-lg md:text-xl font-bold text-purple-900 mb-3">
                {item.q}
              </h3>

              <p className="text-gray-700 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FAQ;
