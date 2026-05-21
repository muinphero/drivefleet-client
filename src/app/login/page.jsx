"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";

import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/";

  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      const response = await authClient.signIn.email({
        email: form.get("email"),

        password: form.get("password"),
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const session = await authClient.getSession();

      setUser(session?.data?.user || null);

      toast.success("Login successful");

      router.push(redirect);
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      setLoading(true);

      await authClient.signIn.social({
        provider: "google",

        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}${redirect}`,
      });
    } catch {
      toast.error("Google login failed");

      setLoading(false);
    }
  }

  return (
    <section
      className="
        min-h-[calc(100vh-80px)]
        flex
        items-center
        justify-center
        px-6
      "
    >
      <div
        className="
          w-full
          max-w-[420px]
          rounded-3xl
          border
          p-8
        "
      >
        <h1
          className="
            text-5xl
            font-bold
            mb-4
          "
        >
          Welcome Back
        </h1>

        <p
          className="
            text-gray-500
            mb-10
          "
        >
          Login to your DriveFleet account
        </p>

        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
          "
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="
              w-full
              h-14
              rounded-2xl
              border
              px-5
            "
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="
              w-full
              h-14
              rounded-2xl
              border
              px-5
            "
          />

          <button
            disabled={loading}
            className="
              w-full
              h-14
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          className="
            my-8
            flex
            items-center
            gap-5
          "
        >
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-gray-400">OR</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="
            w-full
            h-14
            rounded-2xl
            border
            flex
            items-center
            justify-center
            gap-3
          "
        >
          <FcGoogle />
          Continue with Google
        </button>

        <p
          className="
            text-center
            mt-8
            text-gray-600
          "
        >
          No account?
          <Link
            href="/register"
            className="
              text-blue-600
              ml-2
            "
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
