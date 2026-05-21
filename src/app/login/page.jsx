// "use client";

// import { useEffect, useState } from "react";

// import Link from "next/link";

// import { useRouter, useSearchParams } from "next/navigation";

// import { toast } from "sonner";

// import { FcGoogle } from "react-icons/fc";

// import { authClient } from "@/lib/auth-client";

// import { useAuth } from "@/providers/AuthProvider";

// export default function LoginPage() {
//   const router = useRouter();

//   const searchParams = useSearchParams();

//   const redirect = searchParams.get("redirect") || "/";

//   const { user, refreshSession } = useAuth();

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       router.replace(redirect);
//     }
//   }, [user, router, redirect]);

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (loading) return;

//     setLoading(true);

//     try {
//       const form = new FormData(e.currentTarget);

//       const email = form.get("email");

//       const password = form.get("password");

//       // attempt login
//       await authClient.signIn.email({
//         email,
//         password,

//         disableRedirect: true,
//       });

//       // VERIFY LOGIN REALLY HAPPENED
//       const session = await authClient.getSession();

//       if (!session?.data?.user) {
//         toast.error("Invalid email or password");

//         return;
//       }

//       await refreshSession();

//       // create jwt
//       fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/jwt`, {
//         method: "POST",

//         credentials: "include",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           email: session.data.user.email,

//           id: session.data.user.id,
//         }),
//       }).catch(() => {});

//       toast.success("Login successful");

//       router.push(redirect);
//     } catch (error) {
//       console.error(error);

//       toast.error("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   }
//   async function handleGoogle() {
//     try {
//       setLoading(true);

//       await authClient.signIn.social({
//         provider: "google",

//         callbackURL: process.env.NEXT_PUBLIC_BASE_URL || "/",
//       });
//     } catch {
//       toast.error("Google login failed");

//       setLoading(false);
//     }
//   }

//   return (
//     <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
//       <div className="w-full max-w-[420px] rounded-3xl border p-8">
//         <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>

//         <p className="text-gray-500 mb-10">Login to your DriveFleet account</p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             name="email"
//             type="email"
//             required
//             placeholder="Email"
//             className="w-full h-14 rounded-2xl border px-5"
//           />

//           <input
//             name="password"
//             type="password"
//             required
//             placeholder="Password"
//             className="w-full h-14 rounded-2xl border px-5"
//           />

//           <button
//             disabled={loading}
//             className="w-full h-14 rounded-2xl bg-blue-600 text-white"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <button
//           disabled={loading}
//           onClick={handleGoogle}
//           className="w-full h-14 rounded-2xl border mt-6"
//         >
//           <FcGoogle className="inline mr-2" />
//           Continue with Google
//         </button>

//         <p className="mt-6 text-center">
//           No account?
//           <Link href="/register" className="text-blue-600 ml-2">
//             Register
//           </Link>
//         </p>
//       </div>
//     </section>
//   );
// }

"use client";

import { Suspense } from "react";

import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          Loading...
        </section>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
