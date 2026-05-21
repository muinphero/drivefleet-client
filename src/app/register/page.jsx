"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";

export default function RegisterPage() {
  const [formLoading, setFormLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(form);

    const name = formData.get("name");

    const email = formData.get("email");

    const password = formData.get("password");

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");

      setFormLoading(false);

      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password needs uppercase");

      setFormLoading(false);

      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password needs lowercase");

      setFormLoading(false);

      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,

        callbackURL: "http://localhost:3000",
      });

      if (error) {
        toast.error(error.message || "Registration failed");

        return;
      }

      toast.success("Registration successful");

      form.reset();

      router.push("/");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",

        callbackURL: "http://localhost:3000",

        newUserCallbackURL: "http://localhost:3000",
      });
    } catch (error) {
      console.error(error);

      setGoogleLoading(false);

      toast.error("Google login failed");
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Account</h1>

          <p className="text-gray-500">Join DriveFleet today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            name="name"
            required
            placeholder="Full Name"
            className="w-full rounded-2xl border p-4"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-2xl border p-4"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-2xl border p-4"
          />

          <div className="text-sm text-gray-500">
            • Minimum 6 chars
            <br />• Uppercase + lowercase
          </div>

          <button
            disabled={formLoading}
            className="w-full rounded-2xl bg-blue-600 py-4 text-white"
          >
            {formLoading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-400">OR</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full rounded-2xl border py-4 flex items-center justify-center gap-3"
        >
          {googleLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              Redirecting...
            </>
          ) : (
            <>
              <FcGoogle size={24} />
              Continue with Google
            </>
          )}
        </button>

        <p className="mt-8 text-center">
          Already have an account?
          <Link href="/login" className="ml-1 text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
