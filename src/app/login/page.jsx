"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(form);

    const email = formData.get("email");

    const password = formData.get("password");

    try {
      const { data, error } = await authClient.signIn.email({
        email,

        password,

        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Login failed");

        setLoading(false);

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
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",

        callbackURL: "http://localhost:3000",
      });
    } catch (error) {
      console.error(error);

      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
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
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
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
          className="w-full border py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition font-medium disabled:opacity-50"
        >
          <FcGoogle size={24} />

          {googleLoading ? "Redirecting..." : "Continue with Google"}
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
