"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/providers/AuthProvider";

import PrivateRoute from "@/components/PrivateRoute";

export default function AddCarPage() {
  const { user } = useAuth();

  const router = useRouter();

  const [formLoading, setFormLoading] = useState(false);

  const handleAddCar = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const form = e.currentTarget;

    const data = new FormData(form);

    const carData = {
      carName: data.get("carName"),

      dailyRentalPrice: Number(data.get("dailyRentalPrice")),

      vehicleType: data.get("vehicleType"),

      imageUrl: data.get("imageUrl"),

      seatCapacity: Number(data.get("seatCapacity")),

      pickupLocation: data.get("pickupLocation"),

      description: data.get("description"),

      availability: data.get("availability") === "available",

      bookingCount: 0,

      ownerEmail: user?.email,

      ownerName: user?.name,

      createdAt: new Date(),
    };

    try {
      const response = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/cars`,
{
method:"POST",

credentials:"include",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify(carData),
}
)

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success("Car added successfully");

      form.reset();

      router.push("/my-cars");
    } catch (error) {
      toast.error(error.message || "Failed to add car");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <section className="container-width py-14">
        <div className="max-w-3xl mx-auto rounded-3xl border bg-white p-8">
          <h1 className="text-4xl font-bold mb-2">Add Your Car</h1>

          <p className="text-gray-500 mb-8">Publish your vehicle for booking</p>

          <form onSubmit={handleAddCar} className="grid md:grid-cols-2 gap-5">
            <input
              name="carName"
              placeholder="Car Name"
              required
              className="border rounded-xl p-4"
            />

            <input
              name="dailyRentalPrice"
              type="number"
              placeholder="Daily Rent Price"
              required
              className="border rounded-xl p-4"
            />

            <select
              name="vehicleType"
              required
              className="border rounded-xl p-4"
            >
              <option value="">Select Type</option>

              <option>SUV</option>

              <option>Sedan</option>

              <option>Hatchback</option>

              <option>Luxury</option>
            </select>

            <input
              name="imageUrl"
              type="url"
              placeholder="Image URL"
              required
              className="border rounded-xl p-4"
            />

            <input
              name="seatCapacity"
              type="number"
              placeholder="Seat Capacity"
              required
              className="border rounded-xl p-4"
            />

            <input
              name="pickupLocation"
              placeholder="Pickup Location"
              required
              className="border rounded-xl p-4"
            />

            <select
              name="availability"
              required
              className="border rounded-xl p-4"
            >
              <option value="">Availability</option>

              <option value="available">Available</option>

              <option value="unavailable">Unavailable</option>
            </select>

            <div />

            <textarea
              name="description"
              rows="5"
              placeholder="Description"
              required
              className="
                md:col-span-2
                border
                rounded-xl
                p-4
              "
            />

            <button
              disabled={formLoading}
              className="
                md:col-span-2
                rounded-2xl
                bg-blue-600
                text-white
                py-4
                disabled:opacity-60
              "
            >
              {formLoading ? "Publishing..." : "Add Car"}
            </button>
          </form>
        </div>
      </section>
    </PrivateRoute>
  );
}
