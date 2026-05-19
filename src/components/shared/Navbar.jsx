"use client";

import Link from "next/link";

import { useState } from "react";

import { Menu, X } from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, isPending } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();

    toast.success("Logged out");

    setMobileMenuOpen(false);
  };

  const publicLinks = [
    {
      name: "Home",
      href: "/",
    },

    {
      name: "Explore Cars",
      href: "/explore-cars",
    },
  ];

  const privateLinks = [
    {
      name: "Add Car",
      href: "/add-car",
    },

    {
      name: "My Cars",
      href: "/my-cars",
    },

    {
      name: "My Bookings",
      href: "/my-bookings",
    },
  ];

  return (
    <nav className="border-b sticky top-0 bg-white z-50">
      <div className="container-width h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-3xl font-bold text-blue-600">
          DriveFleet
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-16">
          {/* CENTER LINKS */}
          <div className="flex items-center gap-8 font-medium text-lg">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            {!isPending && user ? (
              <>
                {privateLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-blue-600 transition font-medium"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user.name?.charAt(0)}
                  </div>

                  <span className="font-medium">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-xl font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-blue-600 transition font-medium"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden"
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white px-6 py-6 space-y-6">
          {/* PUBLIC LINKS */}
          <div className="space-y-4">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* AUTH LINKS */}
          {!isPending && user ? (
            <>
              <div className="border-t pt-6 space-y-4">
                {privateLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="border-t pt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {user.name?.charAt(0)}
                </div>

                <span className="font-medium">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="border-t pt-6 space-y-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-blue-600 text-white py-3 rounded-xl font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
