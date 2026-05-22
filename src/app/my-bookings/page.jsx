"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { toast } from "sonner";

import { useAuth } from "@/providers/AuthProvider";

import PrivateRoute from "@/components/PrivateRoute";

export default function MyBookingsPage() {
  const { user, loading } = useAuth();

  const [bookings, setBookings] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/user/${user.email}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          setBookings([]);

          return;
        }

        const data = await response.json();

        setBookings(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Unable to load bookings");

        setBookings([]);
      } finally {
        setPageLoading(false);
      }
    }

    if (loading) return;

    if (!user?.email) {
      setPageLoading(false);

      return;
    }

    fetchBookings();
  }, [user, loading]);

  function openCancelModal(booking) {
    setSelectedBooking(booking);

    setShowModal(true);
  }

  async function handleCancelBooking() {
    try {
      setCancelLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${selectedBooking._id}`,
        {
          method: "DELETE",

          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      setBookings((prev) =>
        prev.filter((item) => item._id !== selectedBooking._id),
      );

      setShowModal(false);

      setSelectedBooking(null);

      toast.success("Booking cancelled");
    } catch {
      toast.error("Cancel failed");
    } finally {
      setCancelLoading(false);
    }
  }

  if (loading || pageLoading) {
    return (
      <section className="container-width py-20 text-center">
        Loading...
      </section>
    );
  }

  return (
    <PrivateRoute>
      <section className="container-width py-14">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">My Bookings</h1>

          <p className="text-gray-500">View and manage reservations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl border p-14 text-center">
            No bookings found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-3xl overflow-hidden border bg-white shadow-sm"
              >
                <div className="relative h-60">
                  <Image
                    src={
                      booking.carImage ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                    }
                    alt={booking.carName || "Booked car"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold">
                    {booking.carName || "Booked Car"}
                  </h2>

                  <div className="mt-4 space-y-2 text-gray-600">
                    <p>
                      Total Price:
                      <span className="font-semibold">
                        {" "}
                        ${booking.totalPrice || "N/A"}
                      </span>
                    </p>

                    <p>
                      Booking Date:
                      <Link
                        href="/my-bookings"
                        className="ml-2 text-blue-600 underline"
                      >
                        {new Date(
                          booking.bookingDate || booking.createdAt,
                        ).toLocaleDateString()}
                      </Link>
                    </p>

                    <p>
                      Pickup:
                      <span className="font-medium">
                        {" "}
                        {booking.pickupLocation || booking.pickup || "N/A"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => openCancelModal(booking)}
                    className="mt-6 w-full rounded-2xl bg-red-500 py-3 text-white"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold">Cancel Booking?</h2>

              <p className="mt-3">{selectedBooking?.carName}</p>

              <div className="mt-8 flex gap-3">
                <button
                  disabled={cancelLoading}
                  onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-2xl py-3"
                >
                  Keep
                </button>

                <button
                  disabled={cancelLoading}
                  onClick={handleCancelBooking}
                  className="flex-1 rounded-2xl bg-red-500 text-white py-3"
                >
                  {cancelLoading ? "Cancelling..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PrivateRoute>
  );
}
