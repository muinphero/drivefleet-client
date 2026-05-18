"use client";

import { useEffect, useState } from "react";

export default function ExploreCarsPage() {
  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/cars");

        const data = await response.json();

        setCars(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Loading cars...</h1>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">No cars found</h1>
      </section>
    );
  }

  return (
    <section className="container-width py-20">
      <h1 className="text-5xl font-bold mb-10">Explore Cars</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div key={car._id} className="border rounded-2xl overflow-hidden">
            <img
              src={car.imageUrl}
              alt={car.model}
              className="w-full h-60 object-cover"
            />

            <div className="p-5 space-y-3">
              <h2 className="text-2xl font-bold">
                {car.brand} {car.model}
              </h2>

              <p>Type: {car.vehicleType}</p>

              <p>Daily Price: ${car.dailyRentalPrice}</p>

              <p>Bookings: {car.bookingCount}</p>

              <p>Added by: {car.ownerName}</p>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
