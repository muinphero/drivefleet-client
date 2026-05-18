export default function WhyChooseUs() {
  const features = [
    {
      title: "Affordable Pricing",

      description: "Competitive daily rental prices.",
    },

    {
      title: "Verified Owners",

      description: "All vehicles are listed by verified users.",
    },

    {
      title: "Easy Booking",

      description: "Book your favorite car instantly.",
    },
  ];

  return (
    <section className="bg-gray-100">
      <div className="container-width py-24">
        <h2 className="text-5xl font-bold mb-12 text-center">
          Why Choose DriveFleet
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>

              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
