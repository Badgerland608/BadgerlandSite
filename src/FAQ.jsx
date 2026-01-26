import React from 'react';

function FAQ() {
  return (
    <section className="bg-gray-100 py-20">
      <h3 className="text-3xl font-bold text-purple-900 text-center mb-12">
        Frequently Asked Questions
      </h3>

      <div className="max-w-3xl mx-auto space-y-6 px-6">
        {[
          {
            q: "How does pickup & delivery work?",
            a: "You schedule a time, we pick up your laundry, wash & fold it, and deliver it back the next day."
          },
          {
            q: "Do I need to sort my laundry?",
            a: "No — we handle everything for you."
          },
          {
            q: "What areas do you serve?",
            a: "All of Dane County, including Sun Prairie, Madison, Cottage Grove, DeForest, Windsor, Middleton, Fitchburg, Monona, Verona, McFarland, Stoughton, and Waunakee."
          },
          {
            q: "What detergents do you use?",
            a: "We use premium, skin‑safe detergents. Hypoallergenic options are available upon request."
          },
          {
            q: "Is there a minimum order?",
            a: "Yes — $24 minimum for pickup & delivery."
          },
          {
            q: "Do you offer same‑day service?",
            a: "Yes — same‑day service is available in select areas."
          }
        ].map((item) => (
          <div
            key={item.q}
            className="bg-white shadow-md rounded-xl p-6"
          >
            <h4 className="text-xl font-semibold text-purple-800 mb-2">
              {item.q}
            </h4>
            <p className="text-gray-700 text-base leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
