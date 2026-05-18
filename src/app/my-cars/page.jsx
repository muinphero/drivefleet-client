"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function MyCarsPage() {
  const { user, isPending } = useAuth();

  const router = useRouter();

  const [cars, setCars] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");

      return;
    }

    const fetchCars = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/cars/owner/${user.email}`,
        );

        const data = await response.json();

        setCars(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchCars();
    }
  }, [user, isPending, router]);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure?");

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/cars/${id}`, {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: user.email,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCars((prev) => prev.filter((car) => car._id !== id));

      toast.success("Car deleted");
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  if (loading || isPending) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </section>
    );
  }

  return (
    <section className="container-width py-20">
      <h1 className="text-5xl font-bold mb-10">My Cars</h1>

      {cars.length === 0 ? (
        <h2 className="text-2xl">No cars added yet</h2>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border">Image</th>

                <th className="p-4 border">Car</th>

                <th className="p-4 border">Price</th>

                <th className="p-4 border">Bookings</th>

                <th className="p-4 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td className="p-4 border">
                    <img
                      src={car.imageUrl}
                      alt={car.model}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </td>

                  <td className="p-4 border">
                    {car.brand} {car.model}
                  </td>

                  <td className="p-4 border">${car.dailyRentalPrice}</td>

                  <td className="p-4 border">{car.bookingCount}</td>

                  <td className="p-4 border">
                    <div className="flex gap-3">
                      <Link
                        href={`/update-car/${car._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Update
                      </Link>

                      <button
                        onClick={() => handleDelete(car._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
