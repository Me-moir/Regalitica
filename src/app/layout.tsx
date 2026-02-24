import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import "@/styles/About.module.css";

export const metadata: Metadata = {
  title: "Notus Regalia",
  description: "Building Systems, Ventures, and Future Companies",
  icons: {
    icon: [
      { url: '/assets/notus-regalia-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/assets/notus-regalia-logo.svg' }]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}