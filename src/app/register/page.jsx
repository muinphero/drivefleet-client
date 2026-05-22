"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
const router = useRouter();

const [loading, setLoading] =
useState(false);

async function handleSubmit(e) {
e.preventDefault();

if (loading) return;

setLoading(true);

try {

const form =
new FormData(
e.currentTarget,
);

const result =
await authClient
.signUp
.email({

name:
form.get("name"),

email:
form.get("email"),

password:
form.get("password"),

disableRedirect:
true,

});

if (
result?.error
) {

toast.error(
result.error.message
);

return;

}

toast.success(
"Registration successful"
);

router.replace(
"/login"
);

} catch {

toast.error(
"Registration failed"
);

} finally {

setLoading(false);

}
}

async function googleRegister() {

await authClient
.signIn
.social({

provider:
"google",

callbackURL:
window.location.origin,

newUserCallbackURL:
window.location.origin,

});

}

return (
<section className="min-h-screen flex justify-center items-center px-6">

<div className="w-full max-w-md border rounded-3xl p-8">

<h1 className="text-4xl font-bold mb-6">
Register
</h1>

<form
onSubmit={handleSubmit}
className="space-y-4"
>

<input
name="name"
required
placeholder="Name"
className="w-full p-4 border rounded-xl"
/>

<input
name="email"
type="email"
required
placeholder="Email"
className="w-full p-4 border rounded-xl"
/>

<input
name="password"
type="password"
required
placeholder="Password"
className="w-full p-4 border rounded-xl"
/>

<button
className="w-full h-14 bg-blue-600 text-white rounded-xl"
>

{loading
? "Creating..."
: "Register"}

</button>

</form>

<button
onClick={googleRegister}
className="w-full h-14 border mt-5 rounded-xl"
>

<FcGoogle className="inline mr-2"/>

Continue with Google

</button>

<p className="mt-6">

Already registered?

<Link
href="/login"
className="ml-2 text-blue-600"
>

Login

</Link>

</p>

</div>

</section>
);

}
