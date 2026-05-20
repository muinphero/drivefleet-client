import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/providers/Providers";
import { AuthProvider } from "@/context/AuthProvider";

import { HeroUIProvider } from "@heroui/react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "DriveFleet",
  description: "Modern car rental platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <Providers>
            <Navbar />

            <main className="min-h-screen">{children}</main>

            <Footer />
          </Providers>
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
