"use client";

import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import { useAuth } from "@/hooks/useAuth";

import { toast } from "sonner";

export default function Navbar() {
  const { user, isPending } = useAuth();

  const handleLogout = async () => {
    await authClient.signOut();

    toast.success("Logged out");
  };

  return (
    <nav className="border-b sticky top-0 bg-white z-50">
      <div className="container-width flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          DriveFleet
        </Link>

        <div className="flex gap-6 font-medium items-center">
          <Link href="/">Home</Link>

          <Link href="/explore-cars">Explore Cars</Link>

          {!isPending && user && (
            <>
              <Link href="/add-car">Add Car</Link>

              <Link href="/my-cars">My Cars</Link>

              <Link href="/my-bookings">My Bookings</Link>

              <span>{user.name}</span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Logout
              </button>
            </>
          )}

          {!isPending && !user && (
            <>
              <Link href="/login">Login</Link>

              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
