"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function MyBookingsPage() {
  const { user, isPending } = useAuth();

  const router = useRouter();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");

      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/bookings/user/${user.email}`,
        );

        const data = await response.json();

        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchBookings();
    }
  }, [user, isPending, router]);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = confirm("Cancel this booking?");

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/bookings/${bookingId}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: user.email,
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId),
      );

      toast.success("Booking cancelled");
    } catch (error) {
      console.error(error);

      toast.error("Failed to cancel booking");
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
      <h1 className="text-5xl font-bold mb-10">My Bookings</h1>

      {bookings.length === 0 ? (
        <h2 className="text-2xl">No bookings found</h2>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-2xl overflow-hidden"
            >
              <img
                src={booking.carImage}
                alt={booking.carModel}
                className="w-full h-60 object-cover"
              />

              <div className="p-5 space-y-3">
                <h2 className="text-2xl font-bold">
                  {booking.carBrand} {booking.carModel}
                </h2>

                <p>Booked By: {booking.userName}</p>

                <p>Owner: {booking.ownerEmail}</p>

                <p>
                  Booking Date:{" "}
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </p>

                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="w-full bg-red-500 text-white py-3 rounded-xl"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
