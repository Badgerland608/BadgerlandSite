
import React from 'react';

function ServiceArea() {
  const cities = [
    "Sun Prairie",
    "Madison",
    "Cottage Grove",
    "DeForest",
    "Windsor",
    "Middleton",
    "Fitchburg",
    "Monona",
    "Verona",
    "McFarland",
    "Stoughton",
    "Waunakee"
  ];

  return (
    <section className="bg-gray-100 py-20 px-4 text-center">
      <div className="max-w-5xl mx-auto">

        <p className="text-purple-700 font-bold uppercase tracking-widest text-sm mb-3">
          Local Pickup & Delivery
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
          Serving Madison, Sun Prairie & Surrounding Communities
        </h2>

        <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed mb-10">
          Badgerland Laundry provides convenient pickup and delivery
          for local businesses and households throughout our service area.
          We serve the following communities and welcome inquiries from
          nearby areas.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {cities.map((city) => (
            <span
              key={city}
              className="bg-white border border-purple-100 shadow-sm rounded-full px-5 py-3 text-purple-800 font-medium"
            >
              {city}
            </span>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Not sure if your business is within our pickup area? Contact us
          and we'll be happy to discuss your location.
        </p>

      </div>
    </section>
  );
}

export default ServiceArea;
