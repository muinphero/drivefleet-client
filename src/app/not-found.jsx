"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="
        min-h-[calc(100vh-80px)]
        flex
        items-center
        justify-center
        px-6
      "
    >
      <div
        className="
          text-center
          max-w-xl
        "
      >
        <div
          className="
            inline-flex
            items-center
            justify-center
            w-24
            h-24
            rounded-full
            bg-blue-50
            text-blue-600
            text-5xl
            font-bold
            mb-8
          "
        >
          404
        </div>

        <h1
          className="
            text-5xl
            font-bold
            text-gray-900
            mb-4
          "
        >
          Page Not Found
        </h1>

        <p
          className="
            text-lg
            text-gray-500
            mb-10
          "
        >
          Sorry, the page you are looking for does not exist or may have been
          moved.
        </p>

        <Link
          href="/"
          className="
            inline-flex
            items-center
            justify-center
            px-8
            h-14
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            transition
          "
        >
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}
