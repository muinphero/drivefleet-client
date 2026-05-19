"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
export default function ExploreCarsPage() {
  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [availability, setAvailability] = useState("");

  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const queryParams = new URLSearchParams();

        if (search) {
          queryParams.append("search", search);
        }

        if (availability) {
          queryParams.append("availability", availability);
        }

        if (sort) {
          queryParams.append("sort", sort);
        }

        const response = await fetch(
          `http://localhost:5001/api/cars?${queryParams.toString()}`,
        );

        const data = await response.json();

        setCars(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [search, availability, sort]);
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
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by brand or model"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-xl"
        />

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="border p-3 rounded-xl"
        >
          <option value="">All Cars</option>

          <option value="available">Available Only</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-3 rounded-xl"
        >
          <option value="">Sort By Price</option>

          <option value="asc">Low to High</option>

          <option value="desc">High to Low</option>
        </select>
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
              <h2 className="text-2xl font-bold">
                {car.brand} {car.model}
              </h2>

              <p>Type: {car.vehicleType}</p>

              <p>Daily Price: ${car.dailyRentalPrice}</p>

              <p>Bookings: {car.bookingCount}</p>

              <p>Added by: {car.ownerName}</p>
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
