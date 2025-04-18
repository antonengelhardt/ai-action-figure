import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Action Figure Generator - Create Your Own Custom Action Figure",
  description: "Generate a custom action figure of yourself with AI. Upload a photo, customize details, and get a unique collectible-style action figure image.",
  keywords: ["action figure", "AI", "image generation", "collectible", "custom toy", "personalized", "DALL-E", "AI art"],
  authors: [{ name: "Anton Engelhardt", url: "https://buymeacoffee.com/antonengelhardt" }],
  creator: "Anton Engelhardt",
  metadataBase: new URL("https://ai-action-figure.me"),
  openGraph: {
    title: "Action Figure Generator - Create Your Own Custom Action Figure",
    description: "Generate a custom action figure of yourself with AI. Upload a photo, customize details, and get a unique collectible-style action figure image.",
    url: "https://ai-action-figure.me",
    siteName: "Action Figure Generator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Action Figure Generator - Create your own custom action figure"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Action Figure Generator - Create Your Own Custom Action Figure",
    description: "Generate a custom action figure of yourself with AI. Upload a photo, customize details, and get a unique collectible-style action figure image.",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-K7QX7P5276"></Script>
        <Script id="google-tag">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-K7QX7P5276');
          `}
        </Script>
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
