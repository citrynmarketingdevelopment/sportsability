import type { Metadata } from "next";
import { Nunito_Sans, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const heading = Nunito_Sans({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = Source_Sans_3({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const indexable = process.env.VERCEL_ENV === "production" && Boolean(process.env.SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "SportAbility | Adaptive Soccer in Bakersfield", template: "%s | SportAbility" },
  description: "Adaptive soccer for children of all abilities in Bakersfield. Build skills, confidence, and friendships through small-group and one-on-one programs.",
  robots: { index: indexable, follow: indexable },
  openGraph: { title: "Every athlete. Every ability. | SportAbility", description: "Adaptive soccer in Bakersfield, helping children build skills, confidence, and friendships.", siteName: "SportAbility", locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${heading.variable} ${body.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content" tabIndex={-1}>{children}</main><Footer/></body></html>;
}
