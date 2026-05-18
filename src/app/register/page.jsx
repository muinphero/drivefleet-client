export default function RegisterPage() {
  return (
    <section className="container-width py-20">
      <div className="max-w-md mx-auto border rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-xl"
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
            Register
          </button>
        </form>
      </div>
    </section>
  );
}
