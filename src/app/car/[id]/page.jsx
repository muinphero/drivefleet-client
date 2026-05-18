"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { useParams } from "next/navigation";

export default function CarDetailsPage() {
  const params = useParams();

  const id = params.id;

  const [car, setCar] = useState(null);

  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const router = useRouter();

  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/cars/${id}`);

        const data = await response.json();

        setCar(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Loading car...</h1>
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

  const handleBooking = async () => {
    if (!user) {
      router.push("/login");

      return;
    }

    try {
      setBookingLoading(true);

      const bookingData = {
        carId: car._id,

        carModel: car.model,

        carBrand: car.brand,

        carImage: car.imageUrl,

        bookingDate: new Date(),

        userEmail: user.email,

        userName: user.name,

        ownerEmail: car.ownerEmail,
      };

      const response = await fetch("http://localhost:5001/api/bookings", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Booking successful");

      setCar((prev) => ({
        ...prev,

        bookingCount: prev.bookingCount + 1,
      }));
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="container-width py-20">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <img
            src={car.imageUrl}
            alt={car.model}
            className="w-full rounded-2xl"
          />
        </div>

        <div className="space-y-5">
          <h1 className="text-5xl font-bold">
            {car.brand} {car.model}
          </h1>

          <p className="text-xl">Type: {car.vehicleType}</p>

          <p className="text-xl">Registration: {car.registrationNumber}</p>

          <p className="text-xl">Daily Price: ${car.dailyRentalPrice}</p>

          <p className="text-xl">
            Availability: {car.availability ? "Available" : "Unavailable"}
          </p>

          <p className="text-xl">Booking Count: {car.bookingCount}</p>

          <p className="text-lg leading-relaxed">{car.description}</p>

          <p>Added by: {car.ownerName}</p>

          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl"
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>
    </section>
  );
}
