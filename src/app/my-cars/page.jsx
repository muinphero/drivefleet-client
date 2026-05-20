"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

import PrivateRoute from "@/components/PrivateRoute";

export default function MyCarsPage() {
  const { user, isPending } = useAuth();

  const router = useRouter();

  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedCarId, setSelectedCarId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // FETCH USER CARS
  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");

      return;
    }

    const fetchCars = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/owner/${user.email}`,
        );

        const data = await response.json();

        setCars(data);
      } catch (error) {
        console.error(error);

        toast.error("Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchCars();
    }
  }, [user, isPending, router]);

  // OPEN DELETE MODAL
  const openDeleteModal = (carId) => {
    setSelectedCarId(carId);

    setShowModal(true);
  };

  // DELETE CAR
  const handleDeleteCar = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${selectedCarId}?email=${user.email}`,
        {
          method: "DELETE",
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
  if (loading || isPending) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </section>
    );
  }

  return (
    <PrivateRoute>

    <section className="container-width py-20">
      <h1 className="text-5xl font-bold mb-10">My Cars</h1>

      {cars.length === 0 ? (
        <h2 className="text-2xl">No cars added yet</h2>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car._id}
              className="border rounded-2xl overflow-hidden bg-white"
            >
              {/* IMAGE */}
              <div className="relative w-full h-60">
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
              <div className="p-5 space-y-3">
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
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
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
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
                  >
                    Update
                  </Link>

                  <button
                    onClick={() => openDeleteModal(car._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-6">
            <h2 className="text-2xl font-bold">Delete Car</h2>

            <p>Are you sure you want to delete this car?</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-xl"
              >
                Close
              </button>

              <button
                onClick={handleDeleteCar}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  </PrivateRoute>
}
