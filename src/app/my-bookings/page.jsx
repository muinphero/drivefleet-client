"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { toast } from "sonner";

import { useAuth } from "@/providers/AuthProvider";

import PrivateRoute from "@/components/PrivateRoute";

export default function MyBookingsPage() {
  const { user, loading } = useAuth();

  // `${process.env.NEXT_PUBLIC_API_URL}/api/cars`

  const [bookings, setBookings] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // FETCH BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/user/${user.email}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        setBookings(Array.isArray(data) ? data : data.bookings || []);
      } catch (error) {
        console.error(error);

        toast.error("Failed to fetch bookings");
      } finally {
        setPageLoading(false);
      }
    };

    if (user?.email) {
      fetchBookings();
    }
  }, [user, loading]);

  // OPEN MODAL
  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);

    setShowModal(true);
  };

  // CANCEL BOOKING
  const handleCancelBooking = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${selectedBookingId}`,
        {
          method: "DELETE",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // REMOVE FROM UI
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== selectedBookingId),
      );

      toast.success("Booking cancelled");

      setShowModal(false);

      setSelectedBookingId(null);
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to cancel booking");
    }
  };

  // LOADING
  if (loading || pageLoading) {
    return (
      <section className="container-width py-20">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </section>
    );
  }

  return (
    <PrivateRoute>
      <section className="container-width py-20">
        <h1 className="text-5xl font-bold mb-10">My Bookings</h1>

        {bookings.length === 0 ? (
          <h2 className="text-2xl">No bookings found</h2>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-2xl overflow-hidden bg-white"
              >
                {/* IMAGE */}
                <div className="relative w-full h-60">
                  <Image
                    src={
                      booking.carImage ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                    }
                    alt={booking.carModel || "Booked car image"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
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
                    onClick={() => openCancelModal(booking._id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CUSTOM MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-6">
              <h2 className="text-2xl font-bold">Cancel Booking</h2>

              <p>Are you sure you want to cancel this booking?</p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border rounded-xl"
                >
                  Close
                </button>

                <button
                  onClick={handleCancelBooking}
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PrivateRoute>
  );
}
