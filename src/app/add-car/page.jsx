"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

export default function AddCarPage() {
  const { user, isPending } = useAuth();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  const handleAddCar = async (e) => {
    e.preventDefault();

    setLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(form);

    const carData = {
      model: formData.get("model"),
      brand: formData.get("brand"),

      dailyRentalPrice: Number(formData.get("dailyRentalPrice")),

      vehicleType: formData.get("vehicleType"),

      registrationNumber: formData.get("registrationNumber"),

      imageUrl: formData.get("imageUrl"),

      description: formData.get("description"),

      bookingCount: 0,

      availability: true,

      createdAt: new Date(),

      ownerEmail: user?.email,

      ownerName: user?.name,
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(carData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Car added successfully");

      form.reset();

      console.log(data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return null;
  }

  return (
    <section className="container-width py-20">
      <div className="max-w-2xl mx-auto border rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-8">Add Car</h1>

        <form onSubmit={handleAddCar} className="space-y-4">
          <input
            name="model"
            type="text"
            placeholder="Car Model"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="brand"
            type="text"
            placeholder="Brand"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="dailyRentalPrice"
            type="number"
            placeholder="Daily Rental Price"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="vehicleType"
            type="text"
            placeholder="Vehicle Type"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="registrationNumber"
            type="text"
            placeholder="Registration Number"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="imageUrl"
            type="text"
            placeholder="Image URL"
            className="w-full border p-3 rounded-xl"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="5"
            className="w-full border p-3 rounded-xl"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {loading ? "Adding..." : "Add Car"}
          </button>
        </form>
      </div>
    </section>
  );
}
