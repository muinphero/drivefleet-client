"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, isPending } = useAuth();

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  return (
    <section className="container-width py-20">
      <h1 className="text-5xl font-bold">DriveFleet</h1>

      {user ? (
        <p className="mt-6 text-xl">Welcome {user.name}</p>
      ) : (
        <p className="mt-6 text-xl">No user logged in</p>
      )}
    </section>
  );
}
