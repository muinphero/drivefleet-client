"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";

export default function LoginPage() {
  `${process.env.NEXT_PUBLIC_API_URL}/api/cars`;

  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(form);

    const email = formData.get("email");

    const password = formData.get("password");

    try {
      const { data, error } = await authClient.signIn.email({
        email,

        password,

        callbackURL: process.env.NEXT_PUBLIC_CLIENT_URL,
      });

      if (error) {
        toast.error(error.message || "Login failed");

        setFormLoading(false);

        return;
      }

      toast.success("Login successful");

      console.log(data);

      form.reset();

      router.push("/");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",

        callbackURL: "http://localhost:3000",

        newUserCallbackURL: "http://localhost:3000",
      });
    } catch {
      setGoogleLoading(false);

      toast.error("Google login failed");
    }
  };
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border rounded-3xl p-8 shadow-sm bg-white">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>

          <p className="text-gray-500">Login to your DriveFleet account</p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border p-4 rounded-2xl outline-none focus:border-blue-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full border p-4 rounded-2xl outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
          >
            {formLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />

          <span className="text-gray-400 text-sm">OR</span>

          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="
    w-full
    h-12
    rounded-xl
    border
    flex
    items-center
    justify-center
    gap-3
    transition
    hover:bg-gray-50
    disabled:opacity-70
    disabled:cursor-not-allowed
  "
        >
          {googleLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />

              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2c-2.1 1.5-4.7 2.5-7.3 2.5-5.3 0-9.8-3.3-11.4-8l-6.5 5C9.4 39.5 16.1 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.6 5.5l6.3 5.2C40.7 35.2 44 30.1 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>

              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* REGISTER */}
        <p className="text-center mt-8 text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
