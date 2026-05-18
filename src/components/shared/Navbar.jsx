import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b sticky top-0 bg-white z-50">
      <div className="container-width flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold text-blue-600">DriveFleet</h1>

        <div className="flex gap-6 font-medium">
          <Link href="/">Home</Link>

          <Link href="/explore-cars">Explore Cars</Link>

          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
