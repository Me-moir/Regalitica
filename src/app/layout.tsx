import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regalitica",
  description: "Building Systems, Ventures, and Future Companies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
