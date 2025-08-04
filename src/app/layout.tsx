import type { Metadata } from "next";
import { Pacifico, Poppins } from "next/font/google";
import ReduxProvider from "@/Redux/Provider/ReduxProvider";
import "./globals.css";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sova",
  description: "A clean, modern chat app designed for calm, clutter-free conversations. Talk smarter, not louder.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pacifico.variable} ${poppins.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
