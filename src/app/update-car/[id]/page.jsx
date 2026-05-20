"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";

export default function UpdateCarPage() {
  const params = useParams();

  const id = params.id;

  const router = useRouter();

  const [car, setCar] = useState(null);

  const [loading, setLoading] = useState(true);

  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`,
        );

        const data = await response.json();

        setCar(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    setUpdateLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(form);

    const updatedCar = {
      model: formData.get("model"),

      brand: formData.get("brand"),

      dailyRentalPrice: Number(formData.get("dailyRentalPrice")),

      vehicleType: formData.get("vehicleType"),

      registrationNumber: formData.get("registrationNumber"),

      imageUrl: formData.get("imageUrl"),

      description: formData.get("description"),

      availability: formData.get("availability") === "true",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: car.ownerEmail,

            updatedCar,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Car updated successfully");

      router.push("/my-cars");
    } catch (error) {
      console.error(error);

      toast.error("Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </section>
    );
  }

  if (!car) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Car not found</h1>
      </section>
    );
  }

  return (
    <section className="container-width py-20">
      <div className="max-w-2xl mx-auto border rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-8">Update Car</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            name="model"
            type="text"
            defaultValue={car.model}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="brand"
            type="text"
            defaultValue={car.brand}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="dailyRentalPrice"
            type="number"
            defaultValue={car.dailyRentalPrice}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="vehicleType"
            type="text"
            defaultValue={car.vehicleType}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="registrationNumber"
            type="text"
            defaultValue={car.registrationNumber}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="imageUrl"
            type="text"
            defaultValue={car.imageUrl}
            className="w-full border p-3 rounded-xl"
            required
          />

          <textarea
            name="description"
            rows="5"
            defaultValue={car.description}
            className="w-full border p-3 rounded-xl"
            required
          />

          <select
            name="availability"
            defaultValue={String(car.availability)}
            className="w-full border p-3 rounded-xl"
          >
            <option value="true">Available</option>

            <option value="false">Unavailable</option>
          </select>

          <button
            disabled={updateLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {updateLoading ? "Updating..." : "Update Car"}
          </button>
        </form>
      </div>
    </section>
  );
}
