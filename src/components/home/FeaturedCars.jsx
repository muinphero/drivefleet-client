"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/cars");

        const data = await response.json();

        setCars(data.slice(0, 6));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCars();
  }, []);

  return (
    <section className="container-width py-24">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-5xl font-bold">Featured Cars</h2>

        <Link href="/explore-cars" className="text-blue-600 font-semibold">
          View All
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div key={car._id} className="border rounded-2xl overflow-hidden">
            <img
              src={car.imageUrl}
              alt={car.model}
              className="w-full h-60 object-cover"
            />

            <div className="p-5 space-y-3">
              <h3 className="text-2xl font-bold">
                {car.brand} {car.model}
              </h3>

              <p>
                ${car.dailyRentalPrice}
                /day
              </p>

              <Link
                href={`/car/${car._id}`}
                className="block text-center bg-blue-600 text-white py-3 rounded-xl"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
