import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Becho | Circular Economy Marketplace",
  description: "Connect surplus materials with businesses that can reuse them and reduce environmental waste.",
  keywords: "circular economy, waste reduction, sustainability, material reuse, green marketplace",
  openGraph: {
    title: "Becho | Circular Economy Marketplace",
    description: "Connect surplus materials with businesses that can reuse them and reduce environmental waste.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
