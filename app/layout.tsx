import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "founderNonstop - Learn from Successful Founders",
  description: "A discovery platform for solo founders to explore apps and SaaS businesses making money, learn how they grew, and get practical growth tips.",
  keywords: ["app founders", "indie hackers", "solo developers", "SaaS ideas", "app growth", "startup stories", "revenue sharing", "founder stories"],
  authors: [{ name: "founderNonstop" }],
  openGraph: {
    title: "founderNonstop - Learn from Successful Founders",
    description: "A discovery platform for solo founders to explore apps and SaaS businesses making money, learn how they grew, and get practical growth tips.",
    url: "https://foundernonstop.com",
    siteName: "founderNonstop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "founderNonstop - Learn from Successful Founders",
    description: "A discovery platform for solo founders to explore apps and SaaS businesses making money, learn how they grew, and get practical growth tips.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "founderNonstop",
    url: "https://foundernonstop.com",
    description: "A discovery platform for solo founders to explore apps and SaaS businesses making money, learn how they grew, and get practical growth tips.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://foundernonstop.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "founderNonstop",
    url: "https://foundernonstop.com",
    description: "A discovery platform for solo founders to explore apps and SaaS businesses making money, learn how they grew, and get practical growth tips.",
    logo: "https://foundernonstop.com/icon.png",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
