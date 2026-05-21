"use client";

import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/providers/AuthProvider";

export default function HeroSection() {
  const { user, loading } = useAuth();

  const showRegister = !loading && user === null;

  return (
    <section className="overflow-hidden">
      <div className="container-width pt-6 pb-10 lg:pt-8 lg:pb-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}

          <div>
            <div className="inline-flex rounded-full bg-blue-100 px-4 py-2">
              <span className="text-sm font-medium text-blue-700">
                Modern Car Rental Platform
              </span>
            </div>

            <h1
              className="
                mt-4
                text-5xl
                lg:text-6xl
                font-black
                leading-tight
              "
            >
              Drive Your
              <span className="text-blue-600"> Dream Car</span>
            </h1>

            <p
              className="
                mt-4
                text-lg
                text-gray-600
                max-w-xl
              "
            >
              Discover premium vehicles, seamless booking, and unforgettable
              journeys with DriveFleet.
            </p>

            {/* CTA */}

            <div className="mt-8 flex gap-4">
              <Link
                href="/explore-cars"
                className="
                  rounded-2xl
                  bg-blue-600
                  px-8
                  py-4
                  text-white
                  font-medium
                  hover:bg-blue-700
                "
              >
                Explore Cars
              </Link>

              {showRegister && (
                <Link
                  href="/register"
                  className="
                    rounded-2xl
                    border
                    border-gray-300
                    px-8
                    py-4
                    font-medium
                    hover:bg-gray-50
                  "
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT */}

          <div>
            <div
              className="
                relative
                h-[340px]
                md:h-[420px]
                lg:h-[500px]
                rounded-[36px]
                overflow-hidden
              "
            >
              <Image
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                alt="DriveFleet Hero"
                fill
                priority
                loading="eager"
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
