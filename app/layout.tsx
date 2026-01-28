import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oasis - Botanical Food Ordering",
  description: "Experience slow-crafted botanical delicacies harvested from our vertical glasshouse gardens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
