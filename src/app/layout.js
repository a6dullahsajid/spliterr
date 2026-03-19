import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Spliterr - split your expenses easily",
  description: "Spliterr is a platform that allows you to split your expenses with your friends and family.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["spliterr", "split", "expenses", "friends", "family", "splitter", "splitter app", "splitter platform", "splitter software", "splitter app", "splitter platform", "splitter software"],
  authors: [{ name: "Spliterr", url: "https://spliterr.vercel.app" }],
  creator: "Spliterr",
  publisher: "Spliterr",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
