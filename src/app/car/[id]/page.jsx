"use client";

import { useEffect, useState } from "react";

import { use } from "react";

import Image from "next/image";

import PrivateRoute from "@/components/PrivateRoute";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";

import usePageTitle from "@/hooks/usePageTitle";

import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function CarDetailsPage({ params }) {
  const resolvedParams = use(params);

  const id = resolvedParams.id;

  `${process.env.NEXT_PUBLIC_API_URL}/api/cars`;

  const { user } = useAuth();

  const [car, setCar] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);

  const [bookingLoading, setBookingLoading] = useState(false);

  const [driverNeeded, setDriverNeeded] = useState("No");

  const [specialNote, setSpecialNote] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  usePageTitle("Car Details");

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

        toast.error("Failed to fetch car");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleBooking = async () => {
    // if (!user) {
    //   router.push("/login");

    //   return;
    // }

    try {
      setBookingLoading(true);

      const bookingData = {
        carId: car._id,

        carImage: car.imageUrl,

        carBrand: car.brand,

        carModel: car.model,

        dailyRentalPrice: car.dailyRentalPrice,

        userName: user.name,

        userEmail: user.email,

        ownerEmail: car.ownerEmail,

        bookingDate: new Date(),

        driverNeeded,

        specialNote,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(bookingData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success("Car booked successfully");

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingSpinner />;
  }

  if (!car) {
    return (
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <h1 className="text-4xl font-bold">Car not found</h1>
      </section>
    );
  }

  return (
    <PrivateRoute>
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* IMAGE */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden">
            <Image
              src={car.imageUrl}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover"
            />
          </div>

          {/* DETAILS */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                {car.brand} {car.model}
              </h1>

              <p className="text-gray-500 text-lg">{car.description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
                {car.vehicleType}
              </span>

              {car.availability ? (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                  Available
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-medium">
                  Unavailable
                </span>
              )}
            </div>

            <div className="space-y-3 text-lg">
              <p>
                <span className="font-semibold">Daily Price:</span> $
                {car.dailyRentalPrice}
              </p>

              <p>
                <span className="font-semibold">Booking Count:</span>{" "}
                {car.bookingCount}
              </p>

              <p>
                <span className="font-semibold">Location:</span> {car.location}
              </p>

              <p>
                <span className="font-semibold">Registered Number:</span>{" "}
                {car.registrationNumber}
              </p>
            </div>

            <button
              onClick={onOpen}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-4 rounded-2xl font-semibold text-lg"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* BOOKING MODAL */}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          size="2xl"
          backdrop="blur"
          classNames={{
            base: "bg-white border border-gray-200 rounded-3xl",
            header: "border-b border-gray-200 pb-4",
            body: "py-6",
            footer: "border-t border-gray-200 pt-4",
            closeButton: "hover:bg-gray-100 active:bg-gray-200",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-2xl font-bold">
                  Book Car
                </ModalHeader>

                <ModalBody>
                  <div className="space-y-6">
                    {/* CAR INFO */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 space-y-3">
                      <h2 className="text-2xl font-bold">
                        {car.brand} {car.model}
                      </h2>

                      <p className="text-gray-600">
                        Daily Rental Price:
                        <span className="font-semibold ml-2">
                          ${car.dailyRentalPrice}
                        </span>
                      </p>
                    </div>

                    {/* DRIVER */}
                    <div>
                      <label className="block font-semibold mb-2">
                        Driver Needed?
                      </label>

                      <select
                        value={driverNeeded}
                        onChange={(e) => setDriverNeeded(e.target.value)}
                        className="w-full border rounded-xl p-3 outline-none"
                      >
                        <option value="No">No</option>

                        <option value="Yes">Yes</option>
                      </select>
                    </div>

                    {/* NOTE */}
                    <div>
                      <label className="block font-semibold mb-2">
                        Special Note
                      </label>

                      <textarea
                        rows={5}
                        value={specialNote}
                        onChange={(e) => setSpecialNote(e.target.value)}
                        placeholder="Any additional request..."
                        className="w-full border rounded-xl p-3 outline-none resize-none"
                      />
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Cancel
                  </Button>

                  <Button
                    color="primary"
                    className="font-semibold px-6"
                    onPress={async () => {
                      await handleBooking();

                      onClose();
                    }}
                    isLoading={bookingLoading}
                  >
                    Confirm Booking
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </section>
    </PrivateRoute>
  );
}
