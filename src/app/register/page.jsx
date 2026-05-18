"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    const form = e.currentTarget;

    const formData = new FormData(form);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Registration failed");

      setLoading(false);

      return;
    }

    toast.success("Registration successful");

    console.log(data);

    form.reset();

    setLoading(false);
  };

  return (
    <section className="container-width py-20">
      <div className="max-w-md mx-auto border rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-xl"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
}
