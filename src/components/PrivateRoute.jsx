"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "./shared/LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // SHOW LOADER WHILE CHECKING SESSION
  if (loading) {
    return <LoadingSpinner />;
  }

  // PREVENT WHITE FLASH
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Redirecting...</p>
      </div>
    );
  }

  return children;
}
