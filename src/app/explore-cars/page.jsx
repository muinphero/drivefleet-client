"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Image from "next/image";

import { toast } from "sonner";

export default function ExploreCarsPage() {
  const [cars, setCars] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [availability, setAvailability] = useState("");

  const [vehicleType, setVehicleType] = useState("");

  const [sort, setSort] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setPageLoading(true);

        const query = new URLSearchParams();

        if (search) query.append("search", search);

        if (availability) query.append("availability", availability);

        if (vehicleType) query.append("vehicleType", vehicleType);

        if (sort) query.append("sort", sort);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars?${query}`,
          {
            credentials: "include",

            cache: "no-store",
          },
        );

        const data = await res.json();

        setCars(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load cars");

        setCars([]);
      } finally {
        setPageLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, availability, vehicleType, sort]);

  return (
    <section className="container-width py-14">
      <h1 className="text-4xl font-bold mb-10">Explore Cars</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by car name"
          className="border rounded-xl p-4"
        />

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="border rounded-xl p-4"
        >
          <option value="">All Cars</option>

          <option value="available">Available Only</option>
        </select>

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="border rounded-xl p-4"
        >
          <option value="">All Types</option>

          <option value="SUV">SUV</option>

          <option value="Sedan">Sedan</option>

          <option value="Luxury">Luxury</option>

          <option value="Sports">Sports</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl p-4"
        >
          <option value="">Sort Price</option>

          <option value="asc">Low → High</option>

          <option value="desc">High → Low</option>
        </select>
      </div>

      {pageLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div key={car._id} className="rounded-3xl border overflow-hidden">
              <div className="relative h-60">
                <Image
                  src={car.imageUrl}
                  alt={car.model}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h2 className="text-2xl font-bold">
                  {car.brand} {car.model}
                </h2>

                <p>Type: {car.vehicleType}</p>

                <p>Daily: ${car.dailyRentalPrice}</p>

                <p>Bookings: {car.bookingCount || 0}</p>

                <p>Owner: {car.ownerName}</p>

                <p
                  className={
                    car.availability ? "text-green-600" : "text-red-600"
                  }
                >
                  {car.availability ? "Available" : "Unavailable"}
                </p>

                <Link
                  href={`/car/${car._id}`}
                  className="mt-4 block rounded-xl bg-blue-600 py-3 text-center text-white"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
