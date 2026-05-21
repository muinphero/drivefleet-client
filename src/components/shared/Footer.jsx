import Link from "next/link";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const links = [
    {
      title: "Home",
      href: "/",
    },

    {
      title: "Explore Cars",
      href: "/explore-cars",
    },

    {
      title: "Add Car",
      href: "/add-car",
    },

    {
      title: "My Bookings",
      href: "/my-bookings",
    },
  ];

  return (
    <footer
      className="
        mt-20
        border-t
        bg-white
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-16
        "
      >
        <div
          className="
            grid
            gap-12
            md:grid-cols-3
          "
        >
          {/* BRAND */}

          <div>
            <h2
              className="
                text-3xl
                font-bold
                mb-4
              "
            >
              DriveFleet
            </h2>

            <p
              className="
                text-gray-600
                leading-7
              "
            >
              Modern car rental platform built for comfortable, flexible and
              reliable journeys.
            </p>
          </div>

          {/* LINKS */}

          <div>
            <h3
              className="
                text-xl
                font-semibold
                mb-5
              "
            >
              Useful Links
            </h3>

            <div className="space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                      block
                      text-gray-600
                      hover:text-blue-600
                      transition
                    "
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}

          <div>
            <h3
              className="
                text-xl
                font-semibold
                mb-5
              "
            >
              Contact Information
            </h3>

            <div
              className="
                space-y-3
                text-gray-600
              "
            >
              <p>📍 Dhaka, Bangladesh</p>

              <p>📧 support@drivefleet.com</p>

              <p>📞 +880 1234 567890</p>
            </div>

            {/* SOCIAL */}

            <div
              className="
                flex
                gap-3
                mt-8
              "
            >
              <a
                href="#"
                className="
                  w-11
                  h-11
                  rounded-2xl
                  border
                  flex
                  items-center
                  justify-center
                  hover:bg-blue-600
                  hover:text-white
                  transition
                "
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="
                  w-11
                  h-11
                  rounded-2xl
                  border
                  flex
                  items-center
                  justify-center
                  hover:bg-black
                  hover:text-white
                  transition
                "
              >
                <FaXTwitter />
              </a>

              <a
                href="#"
                className="
                  w-11
                  h-11
                  rounded-2xl
                  border
                  flex
                  items-center
                  justify-center
                  hover:bg-pink-600
                  hover:text-white
                  transition
                "
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="
                  w-11
                  h-11
                  rounded-2xl
                  border
                  flex
                  items-center
                  justify-center
                  hover:bg-red-600
                  hover:text-white
                  transition
                "
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div
          className="
            mt-14
            pt-6
            border-t
            text-center
            text-gray-500
          "
        >
          © 2026 DriveFleet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
