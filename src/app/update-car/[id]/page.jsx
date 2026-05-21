"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import PrivateRoute from "@/components/PrivateRoute";

export default function UpdateCarPage() {
  const params = useParams();

  const router = useRouter();

  const id = params.id;

  const [car, setCar] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    async function fetchCar() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        setCar(data);
      } catch {
        toast.error("Unable to load car");
      } finally {
        setPageLoading(false);
      }
    }

    if (id) {
      fetchCar();
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    setUpdateLoading(true);

    const form = new FormData(e.currentTarget);

    const updatedCar = {
      dailyRentalPrice: Number(form.get("dailyRentalPrice")),

      vehicleType: form.get("vehicleType"),

      imageUrl: form.get("imageUrl"),

      pickupLocation: form.get("pickupLocation"),

      description: form.get("description"),

      availability: form.get("availability") === "available",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`,
        {
          method: "PATCH",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            updatedCar,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Car updated");

      router.push("/my-cars");
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <section className="container-width py-20 text-center">
        Loading...
      </section>
    );
  }

  if (!car) {
    return (
      <section className="container-width py-20 text-center">
        Car not found
      </section>
    );
  }

  return (
    <PrivateRoute>
      <section className="container-width py-14">
        <div className="max-w-3xl mx-auto rounded-3xl border bg-white p-8">
          <h1 className="text-4xl font-bold">Update Car</h1>

          <p className="text-gray-500 mt-2 mb-8">Edit your listing</p>

          <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-5">
            <input
              type="number"
              name="dailyRentalPrice"
              defaultValue={car.dailyRentalPrice}
              placeholder="Price"
              required
              className="border rounded-xl p-4"
            />

            <select
              name="vehicleType"
              defaultValue={car.vehicleType}
              className="border rounded-xl p-4"
            >
              <option>SUV</option>

              <option>Sedan</option>

              <option>Hatchback</option>

              <option>Luxury</option>
            </select>

            <input
              name="imageUrl"
              defaultValue={car.imageUrl}
              placeholder="Image URL"
              required
              className="border rounded-xl p-4"
            />

            <input
              name="pickupLocation"
              defaultValue={car.pickupLocation}
              placeholder="Pickup Location"
              required
              className="border rounded-xl p-4"
            />

            <select
              name="availability"
              defaultValue={car.availability ? "available" : "unavailable"}
              className="border rounded-xl p-4"
            >
              <option value="available">Available</option>

              <option value="unavailable">Unavailable</option>
            </select>

            <div />

            <textarea
              name="description"
              rows="6"
              defaultValue={car.description}
              className="
                md:col-span-2
                border
                rounded-xl
                p-4
              "
            />

            <button
              disabled={updateLoading}
              className="
                md:col-span-2
                rounded-2xl
                bg-blue-600
                text-white
                py-4
                disabled:opacity-60
              "
            >
              {updateLoading ? "Updating..." : "Update Car"}
            </button>
          </form>
        </div>
      </section>
    </PrivateRoute>
  );
}
