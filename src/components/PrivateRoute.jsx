"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && user === null) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // WAIT FOR SESSION

  if (loading || user === undefined) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />

          <p className="text-gray-500">Loading...</p>
        </div>
      </section>
    );
  }

  // REDIRECT IN PROGRESS

  if (user === null) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">Redirecting...</p>
      </section>
    );
  }

  return children;
}
