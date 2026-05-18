import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="container-width py-24">
      <div className="bg-blue-600 text-white rounded-3xl p-16 text-center space-y-6">
        <h2 className="text-5xl font-bold">Ready To Start Driving?</h2>

        <p className="text-xl">
          Explore hundreds of cars available for booking.
        </p>

        <Link
          href="/explore-cars"
          className="inline-block bg-white text-black px-8 py-4 rounded-2xl"
        >
          Browse Cars
        </Link>
      </div>
    </section>
  );
}
