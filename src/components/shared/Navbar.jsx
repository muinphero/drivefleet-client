"use client";

import Link from "next/link";

import { useState, useEffect, useRef } from "react";

import { Menu, X, ChevronDown } from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, loading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const mobileMenuRef = useRef(null);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const closeAll = () => {
    setProfileOpen(false);

    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/jwt/logout`, {
        method: "POST",

        credentials: "include",
      });

      closeAll();

      toast.success("Logged out");

      window.location.href = "/";
    } catch {
      toast.error("Logout failed");
    }
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

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="container-width h-[72px] flex items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-lg">
            🚘
          </div>

          <div>
            <h1 className="text-[30px] font-black leading-none">DriveFleet</h1>

            <p className="text-xs text-gray-500">Rent • Drive • Explore</p>
          </div>
        </Link>

        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] flex-1 items-center">
          <div />

          <div className="flex gap-10 justify-center">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium hover:text-blue-600"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div ref={profileRef} className="flex justify-end min-w-[260px]">
            {loading ? (
              <div className="h-[44px] w-[180px]" />
            ) : user ? (
              <>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="h-[46px] px-3 rounded-xl flex items-center gap-3 hover:bg-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {user.name?.charAt(0)}
                  </div>

                  <span>{user.name}</span>

                  <ChevronDown size={18} />
                </button>

                {profileOpen && (
                  <div className="absolute top-[72px] right-6 w-72 rounded-2xl bg-white border shadow-xl overflow-hidden">
                    <div className="p-5 bg-blue-600 text-white">
                      <h3 className="font-bold">{user.name}</h3>

                      <p className="text-sm">{user.email}</p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/add-car"
                        onClick={closeAll}
                        className="block px-4 py-3 rounded-xl hover:bg-gray-50"
                      >
                        Add Car
                      </Link>

                      <Link
                        href="/my-cars"
                        onClick={closeAll}
                        className="block px-4 py-3 rounded-xl hover:bg-gray-50"
                      >
                        My Cars
                      </Link>

                      <Link
                        href="/my-bookings"
                        onClick={closeAll}
                        className="block px-4 py-3 rounded-xl hover:bg-gray-50"
                      >
                        My Bookings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="h-[44px] px-5 border rounded-xl flex items-center"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="h-[44px] px-5 rounded-xl bg-blue-600 text-white flex items-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="ml-auto lg:hidden"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* RESTORED MOBILE MENU */}

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden absolute top-[68px] right-3 w-[250px] rounded-2xl bg-white border shadow-xl"
        >
          <div className="p-3">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeAll}
                className="block px-3 py-2 rounded-xl"
              >
                {link.name}
              </Link>
            ))}

            {!loading &&
              (user ? (
                <>
                  <Link
                    href="/add-car"
                    onClick={closeAll}
                    className="block px-3 py-2"
                  >
                    Add Car
                  </Link>

                  <Link
                    href="/my-cars"
                    onClick={closeAll}
                    className="block px-3 py-2"
                  >
                    My Cars
                  </Link>

                  <Link
                    href="/my-bookings"
                    onClick={closeAll}
                    className="block px-3 py-2"
                  >
                    My Bookings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full h-9 rounded-xl bg-red-500 text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="h-9 border rounded-xl flex items-center justify-center"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center"
                  >
                    Register
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
