"use client";

import { useEffect } from "react";

import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin" />
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
