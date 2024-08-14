import "styles/tailwind.css";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "app/providers";
import appConfig from "app.config";
import type { Viewport } from "next";

import ClientLayout from "./client-layout";

const title = appConfig.appName;
const description = appConfig.description;
// const image = "https://vercel.pub/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: [
    {
      rel: "icon",
      url: "/icons/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      sizes: "192x192",
      url: "/icons/apple-touch-icon.png",
    },
    {
      rel: "icon",
      sizes: "192x192",
      url: "/icons/android-chrome-192x192.png",
    },
    {
      rel: "icon",
      sizes: "512x512",
      url: "/icons/android-chrome-512x512.png",
    },
  ],
  openGraph: {
    title,
    description,
    // images: [image],
  },

  manifest: "./manifest.json",
  // twitter: {
  //   card: "summary_large_image",
  //   title,
  //   description,
  //   images: [image],
  //   creator: "@vercel",
  // },
  metadataBase: new URL(process.env.NEXTAUTH_URL as string),
};

export const viewport: Viewport = {
  width: "device-width",
  viewportFit: "cover",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: "white",
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
      </head>
      <body className="h-full">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
