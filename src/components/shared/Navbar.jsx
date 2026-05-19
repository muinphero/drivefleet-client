"use client";

import Link from "next/link";

import { useState } from "react";

import { Menu, X, ChevronDown } from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, isPending } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();

    toast.success("Logged out");

    setMobileMenuOpen(false);

    setProfileOpen(false);
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

    {
      name: "Add Car",
      href: "/add-car",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container-width h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="text-4xl font-extrabold text-blue-600 tracking-tight"
        >
          DriveFleet
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-14">
          {/* CENTER LINKS */}
          <div className="flex items-center gap-8 font-medium text-lg">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-600 transition duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5 relative">
            {!isPending && user ? (
              <>
                {/* PROFILE */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-2xl transition"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    {user.name?.charAt(0)}
                  </div>

                  <div className="text-left">
                    <p className="font-semibold leading-none">{user.name}</p>

                    <p className="text-xs text-gray-500">Profile</p>
                  </div>

                  <ChevronDown size={18} />
                </button>

                {/* DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 top-16 w-72 bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
                    {/* USER INFO */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-2xl">
                          {user.name?.charAt(0)}
                        </div>

                        <div>
                          <h3 className="font-bold text-lg">{user.name}</h3>

                          <p className="text-sm text-blue-100 break-all">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* LINKS */}
                    <div className="p-3 flex flex-col">
                      <Link
                        href="/my-cars"
                        onClick={() => setProfileOpen(false)}
                        className="px-4 py-3 rounded-2xl hover:bg-blue-50 transition font-medium"
                      >
                        My Cars
                      </Link>

                      <Link
                        href="/my-bookings"
                        onClick={() => setProfileOpen(false)}
                        className="px-4 py-3 rounded-2xl hover:bg-blue-50 transition font-medium"
                      >
                        My Bookings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="text-left px-4 py-3 rounded-2xl hover:bg-red-50 text-red-500 transition font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-blue-600 transition font-medium text-lg"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-2xl font-semibold shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MOBILE BUTTON */}
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
          {/* LINKS */}
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

          {!isPending && user ? (
            <>
              <div className="border-t pt-6 space-y-4">
                <Link
                  href="/my-cars"
                  className="block text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Cars
                </Link>

                <Link
                  href="/my-bookings"
                  className="block text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
              </div>

              <div className="border-t pt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {user.name?.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold">{user.name}</p>

                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-2xl font-semibold"
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
                className="block text-center bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-2xl font-semibold"
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
