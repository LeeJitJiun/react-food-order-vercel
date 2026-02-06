import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Oasis - Botanical Food Ordering",
  description:
    "Experience well-cooked botanical DELICACIES harvested fresh from our vertical glasshouse gardens.",
  openGraph: {
    title: "Oasis - Botanical Food Ordering",
    description:
      "Experience well-cooked botanical DELICACIES harvested fresh from our vertical glasshouse gardens.",
    url: "https://foodordering.quadrawebs.com",
    siteName: "Oasis",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Oasis - Botanical Food Ordering",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis - Botanical Food Ordering",
    description:
      "Experience well-cooked botanical DELICACIES harvested fresh from our vertical glasshouse gardens.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
