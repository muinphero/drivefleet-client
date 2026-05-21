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

  const [sort, setSort] = useState("");

  const [vehicleType, setVehicleType] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setPageLoading(true);

        const api = process.env.NEXT_PUBLIC_API_URL;

        if (!api) {
          throw new Error("NEXT_PUBLIC_API_URL missing");
        }

        const queryParams = new URLSearchParams();

        if (search) {
          queryParams.append("search", search);
        }

        if (availability) {
          queryParams.append("availability", availability);
        }

        if (vehicleType) {
          queryParams.append("vehicleType", vehicleType);
        }

        if (sort) {
          queryParams.append("sort", sort);
        }

        const response = await fetch(
          `${api}/api/cars?${queryParams.toString()}`,
          {
            credentials: "include",

            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load cars");
        }

        const data = await response.json();

        setCars(Array.isArray(data) ? data : data.cars || []);
      } catch (error) {
        console.error(error);

        setCars([]);

        toast.error("Unable to load cars");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCars();
  }, [search, availability, sort, vehicleType]);

  if (pageLoading) {
    return (
      <section className="container-width py-20">
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section className="container-width py-20 text-center">
        <h1 className="text-3xl font-bold">No cars found</h1>

        <p className="text-gray-500 mt-2">Try changing filters</p>
      </section>
    );
  }

  return (
    <section className="container-width py-14">
      <h1 className="text-4xl font-bold mb-10">Explore Cars</h1>

      {/* FILTERS */}

      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by brand or model"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

          <option value="Sports">Sports</option>

          <option value="Luxury">Luxury</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl p-4"
        >
          <option value="">Sort By Price</option>

          <option value="asc">Low → High</option>

          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* GRID */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div
            key={car._id}
            className="
              overflow-hidden
              rounded-3xl
              border
              bg-white
              hover:shadow-lg
              transition
            "
          >
            <div className="relative h-60">
              <Image
                src={
                  car.imageUrl ||
                  "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                }
                alt={car.model}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="p-5 space-y-2">
              <h2 className="text-2xl font-bold">
                {car.brand} {car.model}
              </h2>

              <p>Type: {car.vehicleType}</p>

              <p>Daily: ${car.dailyRentalPrice}</p>

              <p>Bookings: {car.bookingCount || 0}</p>

              <p>Owner: {car.ownerName}</p>

              <div>
                <span
                  className={
                    car.availability ? "text-green-600" : "text-red-600"
                  }
                >
                  {car.availability ? "Available" : "Unavailable"}
                </span>
              </div>

              <Link
                href={`/car/${car._id}`}
                className="
                  mt-4
                  block
                  rounded-xl
                  bg-blue-600
                  py-3
                  text-center
                  text-white
                "
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
