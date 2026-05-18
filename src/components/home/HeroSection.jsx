import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gray-100">
      <div className="container-width py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Rent Your Perfect Car Today
          </h1>

          <p className="text-xl text-gray-600">
            Explore premium vehicles from trusted owners across the country.
          </p>

          <div className="flex gap-4">
            <Link
              href="/explore-cars"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl"
            >
              Explore Cars
            </Link>

            <Link
              href="/add-car"
              className="border border-black px-8 py-4 rounded-2xl"
            >
              Add Your Car
            </Link>
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
            alt="Car"
            className="rounded-3xl w-full"
          />
        </div>
      </div>
    </section>
  );
}
