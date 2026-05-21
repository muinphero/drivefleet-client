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
      <section className="container-width py-14">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">My Bookings</h1>

          <p className="text-gray-500 mt-2">Manage your booked cars</p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl border bg-white p-12 text-center">
            <h2 className="text-2xl font-semibold">No bookings yet</h2>

            <p className="text-gray-500 mt-2">Explore cars and reserve one.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="
              rounded-3xl
              overflow-hidden
              border
              bg-white
              shadow-sm
              hover:shadow-md
              transition
            "
              >
                <div className="relative h-60">
                  <Image
                    src={
                      booking.carImage ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                    }
                    alt={booking.carModel}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold">
                    {booking.carBrand} {booking.carModel}
                  </h2>

                  <div className="mt-4 space-y-2 text-gray-600">
                    <p>Booked By: {booking.userName}</p>

                    <p>Owner: {booking.ownerEmail}</p>

                    <p>
                      Date: {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => openCancelModal(booking._id)}
                    className="
                    mt-6
                    w-full
                    rounded-2xl
                    bg-red-500
                    py-3
                    text-white
                    hover:bg-red-600
                  "
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div
              className="
        bg-white
        rounded-3xl
        w-full
        max-w-5xl
        overflow-hidden
      "
            >
              {/* HEADER */}

              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-3xl font-bold">Book Car</h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl"
                >
                  ×
                </button>
              </div>

              {/* BODY */}

              <div className="grid lg:grid-cols-2 gap-10 p-8">
                {/* LEFT */}

                <div>
                  <div className="relative h-[280px] rounded-3xl overflow-hidden">
                    <Image
                      src={car.imageUrl}
                      alt={car.model}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-5">
                    <h3 className="text-4xl font-bold">
                      {car.brand} {car.model}
                    </h3>

                    <p className="mt-3 text-xl">
                      Daily Price:
                      <span className="font-bold">${car.dailyRentalPrice}</span>
                    </p>
                  </div>
                </div>

                {/* RIGHT */}

                <form onSubmit={handleBooking} className="space-y-6">
                  <div>
                    <label className="font-semibold">Driver Needed?</label>

                    <select
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
                    <label className="font-semibold">Special Note</label>

                    <textarea
                      rows={6}
                      placeholder="Additional request..."
                      className="
                mt-2
                w-full
                rounded-2xl
                border
                p-4
              "
                    />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="
                flex-1
                border
                rounded-2xl
                py-4
              "
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="
                flex-1
                rounded-2xl
                bg-blue-600
                text-white
                py-4
              "
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>
    </PrivateRoute>
  );
}
