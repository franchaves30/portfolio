import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UtmLogger } from "@/components/utm-logger";


export const metadata = {
  title: "Fran Chaves - Growth & PM Portfolio",
  description:
    "Welcome to my portfolio. See my case studies, product philosophy, and AI projects.",
  openGraph: {
    images: [
      {
        url: "/og?title=Fran Chaves — Growth & PM Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/og?title=Fran Chaves — Growth & PM Portfolio",
      },
    ],
  },
  other: {
    viewport:
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=resizes-content",
  },
};

import { PostHogProvider } from "./posthog-provider";
import PostHogPageView from "./posthog-pageview";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={cn(GeistSans.className, "antialiased dark")}>
        <PostHogProvider>
          <PostHogPageView />
          <UtmLogger />
          <Toaster position="top-center" richColors />
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </PostHogProvider>
      </body>
    </html>
  );
}
