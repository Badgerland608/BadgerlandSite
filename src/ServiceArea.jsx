import React from 'react';

function ServiceArea() {
  return (
    <section className="bg-gray-100 pt-20 pb-20 text-center">
      <h3 className="text-3xl font-bold text-purple-900 mb-8">
        Proudly Serving All of Dane County
      </h3>

      <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed mb-8 px-4">
        We provide pickup & delivery laundry service across Dane County,
        including Sun Prairie, Madison, Cottage Grove, DeForest, Windsor,
        Middleton, Fitchburg, Monona, Verona, McFarland, Stoughton, and Waunakee.
      </p>

      <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto px-4">
        {[
          "Sun Prairie", "Madison", "Cottage Grove", "DeForest", "Windsor",
          "Middleton", "Fitchburg", "Monona", "Verona", "McFarland",
          "Stoughton", "Waunakee"
        ].map((city) => (
          <span
            key={city}
            className="bg-white shadow-md rounded-full px-5 py-2 text-purple-700 font-medium"
          >
            {city}
          </span>
        ))}
      </div>
    </section>
  );
}

export default ServiceArea;
