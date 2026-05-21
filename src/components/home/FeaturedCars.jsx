"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Image from "next/image";

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars`,
        );

        if (!response.ok) return;

        const data = await response.json();

        // Show only first 6 featured cars
        setCars(data.slice(0, 6));
      } catch (error) {
        console.log("Cars unavailable");
      } finally {
        setPageLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  if (pageLoading) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Loading featured cars...</h1>
      </section>
    );
  }

  return (
    <section className="container-width py-20">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-bold">Featured Cars</h1>

        <Link
          href="/explore-cars"
          className="text-blue-600 font-semibold text-xl hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div
            key={car._id}
            className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition duration-300"
          >
            {/* IMAGE */}
            <div className="relative w-full h-64">
              <Image
                src={
                  car.imageUrl?.startsWith("http")
                    ? car.imageUrl
                    : "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                }
                alt={`${car.brand} ${car.model}`}
                fill
                unoptimized
                className="object-cover"
              />

              {/* STATUS BADGE */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                    car.availability ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {car.availability ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-4">
              {/* TITLE */}
              <div>
                <h2 className="text-2xl font-bold">
                  {car.brand} {car.model}
                </h2>

                <p className="text-gray-500">{car.vehicleType}</p>
              </div>

              {/* PRICE */}
              <div>
                <p className="text-3xl font-bold text-blue-600">
                  ${car.dailyRentalPrice}
                  <span className="text-lg text-black font-medium">/day</span>
                </p>
              </div>

              {/* DETAILS */}
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Booking Count:</span>{" "}
                  {car.bookingCount || 0}
                </p>

                <p>
                  <span className="font-semibold">Added By:</span>{" "}
                  {car.ownerName || "DriveFleet Curator"}
                </p>
              </div>

              {/* BUTTON */}
              <Link
                href={`/car/${car._id}`}
                className="block text-center bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-medium"
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
