import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // ✅ Import Script from Next.js

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "World One",
  icons: "/logo.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ AdSense script loaded after page is interactive */}
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5296998056401590"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
