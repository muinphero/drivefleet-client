import "./globals.css";

import { Poppins } from "next/font/google";

import Navbar from "@/components/shared/Navbar";

import Providers from "@/providers/Providers";

import { AuthProvider } from "@/providers/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],

  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "DriveFleet",

  description: "Rent • Drive • Explore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <Providers>
            <Navbar />

            <main className="min-h-screen">{children}</main>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
