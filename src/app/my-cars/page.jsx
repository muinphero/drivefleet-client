"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { toast } from "sonner";

import { useAuth } from "@/providers/AuthProvider";

import PrivateRoute from "@/components/PrivateRoute";

export default function MyCarsPage() {
  const { user, loading } = useAuth();

  const [cars, setCars] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  const [selectedCarId, setSelectedCarId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // FETCH USER CARS
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/owner/${user.email}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        setCars(Array.isArray(data) ? data : data.cars || []);
      } catch (error) {
        console.error(error);

        toast.error("Failed to fetch cars");
      } finally {
        setPageLoading(false);
      }
    };

    if (user?.email) {
      fetchCars();
    }
  }, [user?.email]);

  // OPEN DELETE MODAL
  const openDeleteModal = (carId) => {
    setSelectedCarId(carId);

    setShowModal(true);
  };

  // DELETE CAR
  const handleDeleteCar = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${selectedCarId}`,
        {
          method: "DELETE",

          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // REMOVE FROM UI
      setCars((prev) => prev.filter((car) => car._id !== selectedCarId));

      toast.success("Car deleted successfully");

      setShowModal(false);

      setSelectedCarId(null);
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to delete car");
    }
  };

  // LOADING
  if (loading || pageLoading) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </section>
    );
  }

  return (
    <PrivateRoute>
      <section className="container-width py-20">
        <h1 className="mb-10 text-5xl font-bold">My Cars</h1>

        {cars.length === 0 ? (
          <h2 className="text-2xl">No cars added yet</h2>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car._id}
                className="overflow-hidden rounded-2xl border bg-white"
              >
                {/* IMAGE */}
                <div className="relative h-60 w-full">
                  <Image
                    src={
                      car.imageUrl ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                    }
                    alt={`${car.brand} ${car.model}` || "Car image"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="space-y-3 p-5">
                  <h2 className="text-2xl font-bold">
                    {car.brand} {car.model}
                  </h2>

                  <p>Type: {car.vehicleType}</p>

                  <p>Daily Price: ${car.dailyRentalPrice}</p>

                  <p>
                    Availability:{" "}
                    <span
                      className={
                        car.availability
                          ? "font-semibold text-green-600"
                          : "font-semibold text-red-500"
                      }
                    >
                      {car.availability ? "Available" : "Unavailable"}
                    </span>
                  </p>

                  <p>Bookings: {car.bookingCount}</p>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4 pt-2">
                    <Link
                      href={`/update-car/${car._id}`}
                      className="flex-1 rounded-xl bg-blue-600 py-3 text-center text-white transition hover:bg-blue-700"
                    >
                      Update
                    </Link>

                    <button
                      onClick={() => openDeleteModal(car._id)}
                      className="flex-1 rounded-xl bg-red-500 py-3 text-white transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DELETE MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8">
              <h2 className="text-2xl font-bold">Delete Car</h2>

              <p>Are you sure you want to delete this car?</p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border px-5 py-2"
                >
                  Close
                </button>

                <button
                  onClick={handleDeleteCar}
                  className="rounded-xl bg-red-500 px-5 py-2 text-white transition hover:bg-red-600"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PrivateRoute>
  );
}
