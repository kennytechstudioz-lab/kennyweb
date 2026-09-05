import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kenny Tech Studios | Premium Software & Digital Solutions",
  description: "Kenny Tech Studios specializes in the development of software, web apps, mobile apps, animation, video editing, and digital marketing. Where Creativity Meets Cutting-Edge Technology.",
  keywords: "software development, web apps, mobile apps, animation, video editing, digital marketing, Kenny Tech Studios, IT solutions",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

