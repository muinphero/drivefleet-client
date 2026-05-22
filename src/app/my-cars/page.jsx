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

  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/owner/${user.email}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          setCars([]);
          return;
        }

        const data = await response.json();

        setCars(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to fetch cars");
        setCars([]);
      } finally {
        setPageLoading(false);
      }
    }

    if (loading) return;

    if (!user?.email) {
      setPageLoading(false);
      return;
    }

    fetchCars();
  }, [user, loading]);

  function openDeleteModal(carId) {
    setSelectedCarId(carId);
    setShowModal(true);
  }

  async function handleDeleteCar() {
    try {
      setDeleteLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${selectedCarId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      setCars((prev) =>
        prev.filter(
          (car) => car._id !== selectedCarId,
        ),
      );

      setShowModal(false);

      setSelectedCarId(null);

      toast.success("Car deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading || pageLoading) {
    return (
      <section className="container-width py-20">
        Loading...
      </section>
    );
  }

  return (
    <PrivateRoute>
      <section className="container-width py-20">
        <h1 className="mb-10 text-5xl font-bold">
          My Cars
        </h1>

        {cars.length === 0 ? (
          <h2>No cars added yet</h2>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car._id}
                className="overflow-hidden rounded-2xl border"
              >
                <div className="relative h-60">
                  <Image
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3 p-5">
                  <h2 className="text-2xl font-bold">
                    {car.brand} {car.model}
                  </h2>

                  <p>
                    Type: {car.vehicleType}
                  </p>

                  <p>
                    Daily Price: $
                    {car.dailyRentalPrice}
                  </p>

                  <p>
                    Bookings:
                    {car.bookingCount}
                  </p>

                  <div className="flex gap-4">
                    <Link
                      href={`/update-car/${car._id}`}
                      className="flex-1 rounded-xl bg-blue-600 py-3 text-center text-white"
                    >
                      Update
                    </Link>

                    <button
                      onClick={() =>
                        openDeleteModal(car._id)
                      }
                      className="flex-1 rounded-xl bg-red-500 py-3 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="rounded-2xl bg-white p-8">
              <h2 className="text-2xl font-bold">
                Delete Car
              </h2>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Close
                </button>

                <button
                  disabled={deleteLoading}
                  onClick={handleDeleteCar}
                >
                  {deleteLoading
                    ? "Deleting..."
                    : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PrivateRoute>
  );
}
