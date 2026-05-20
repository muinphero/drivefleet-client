"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";

export default function RegisterPage() {
  `${process.env.NEXT_PUBLIC_API_URL}/api/cars`;

  const [formLoading, setFormLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const handleRegister = async (e) => {
    e.preventDefault();

    setFormLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(form);

    const name = formData.get("name");

    const image = formData.get("image");

    const email = formData.get("email");

    const password = formData.get("password");

    // PASSWORD VALIDATION
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");

      setFormLoading(false);

      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");

      setFormLoading(false);

      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter");

      setFormLoading(false);

      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name,

        email,

        password,

        image,

        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed");

        setFormLoading(false);

        return;
      }

      toast.success("Registration successful");

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

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",

        callbackURL: "/",
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
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>

          <p className="text-gray-500">Join DriveFleet today</p>
        </div>

        {/* REGISTER FORM */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* NAME */}
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            className="w-full border p-4 rounded-2xl outline-none focus:border-blue-500"
          />

          {/* PHOTO URL */}
          <input
            name="image"
            type="url"
            placeholder="Photo URL"
            required
            className="w-full border p-4 rounded-2xl outline-none focus:border-blue-500"
          />

          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border p-4 rounded-2xl outline-none focus:border-blue-500"
          />

          {/* PASSWORD */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full border p-4 rounded-2xl outline-none focus:border-blue-500"
          />

          {/* PASSWORD RULES */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>• Minimum 6 characters</p>

            <p>• At least one uppercase letter</p>

            <p>• At least one lowercase letter</p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
          >
            {formLoading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />

          <span className="text-gray-400 text-sm">OR</span>

          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* GOOGLE REGISTER */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading}
          className="w-full border py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition font-medium disabled:opacity-50"
        >
          <FcGoogle size={24} />

          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        {/* LOGIN */}
        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
