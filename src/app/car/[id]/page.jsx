"use client";

import { use, useEffect, useState } from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import LoadingSpinner from "@/components/shared/LoadingSpinner";

import { useAuth } from "@/providers/AuthProvider";

export default function CarDetailsPage({ params }) {
  const { id } = use(params);

  const router = useRouter();

  const { user } = useAuth();

  const [car, setCar] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showBooking, setShowBooking] = useState(false);

  const [bookingLoading, setBookingLoading] = useState(false);

  const [driverNeeded, setDriverNeeded] = useState("No");

  const [specialNote, setSpecialNote] = useState("");

  useEffect(() => {
    async function loadCar() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`,
        );

        const data = await response.json();

        setCar(data);
      } catch {
        toast.error("Failed to load car");
      } finally {
        setLoading(false);
      }
    }

    loadCar();
  }, [id]);

  async function handleBooking() {
    if (!user) {
      setShowBooking(false);

      toast.error("Please login first");

      router.push(`/login?redirect=/car/${id}`);

      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            carId: car._id,

            carName: `${car.brand} ${car.model}`,

            carBrand: car.brand,

            carModel: car.model,

            carImage: car.imageUrl,

            totalPrice: car.dailyRentalPrice,

            pickup: car.location,

            bookingDate: new Date(),

            driverNeeded,

            specialNote,

            userEmail: user.email,

            userName: user.name,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Booking successful");

      setShowBooking(false);

      router.push("/my-bookings");
    } catch (error) {
      toast.error(error.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!car) {
    return <section className="container-width py-20">Car not found</section>;
  }

  return (
    <section className="container-width py-16">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="relative h-[520px] rounded-3xl overflow-hidden">
          <Image
            src={car.imageUrl}
            alt={car.model}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-bold">
            {car.brand} {car.model}
          </h1>

          <p className="text-gray-600">{car.description}</p>

          <div className="space-y-3">
            <p>
              Daily Price:
              <strong> ${car.dailyRentalPrice}</strong>
            </p>

            <p>Type: {car.vehicleType}</p>

            <p>Location: {car.location}</p>
          </div>

          <button
            onClick={() => setShowBooking(true)}
            className="
              px-8
              py-4
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              transition
            "
          >
            Book Now
          </button>
        </div>
      </div>

      {showBooking && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/60
            flex
            items-center
            justify-center
            p-5
          "
        >
          <div
            className="
              bg-white
              w-full
              max-w-[650px]
              rounded-3xl
              overflow-hidden
              shadow-2xl
            "
          >
            <div className="flex justify-between border-b p-6">
              <h2 className="text-3xl font-bold">Book Car</h2>

              <button onClick={() => setShowBooking(false)}>✕</button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-3xl p-6">
                <h3 className="text-3xl font-bold">
                  {car.brand} {car.model}
                </h3>

                <p className="mt-2">
                  Daily Rental Price
                  <strong> ${car.dailyRentalPrice}</strong>
                </p>
              </div>

              <div>
                <label>Driver Needed?</label>

                <select
                  value={driverNeeded}
                  onChange={(e) => setDriverNeeded(e.target.value)}
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border
                    p-4
                  "
                >
                  <option>No</option>

                  <option>Yes</option>
                </select>
              </div>

              <div>
                <label>Special Note</label>

                <textarea
                  rows="4"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Any additional request..."
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border
                    p-4
                  "
                />
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowBooking(false)}
                className="
                  h-12
                  px-6
                  border
                  rounded-2xl
                "
              >
                Cancel
              </button>

              <button
                disabled={bookingLoading}
                onClick={handleBooking}
                className="
                  h-12
                  px-6
                  rounded-2xl
                  bg-blue-600
                  text-white
                "
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
