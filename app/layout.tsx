import "styles/tailwind.css";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "app/providers";
import { Toaster } from "react-hot-toast";
import appConfig from "app.config";
import CookieNotice from "components/cookie-notice";
import dynamic from "next/dynamic";
import type { Viewport } from "next";

import { Suspense } from "react";
import { headers } from "next/headers";

const Header = dynamic(() => import("../components/navigation/header"), {
  ssr: false,
});

const FeedbackWidget = dynamic(() => import("../components/feedback/feedback-widget"), {
  ssr: false,
});

const title = appConfig.appName;
const description = appConfig.description;
// const image = "https://vercel.pub/thumbnail.png";

export const metadata: Metadata = {
  title,
  description,
  icons: ["./favicon.ico"],
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
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: "white",
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const header_url = headersList.get("x-url") || "";
  const hideHeader = header_url && header_url.includes("/interpretation");
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Toaster />
            {!hideHeader && <Header />}
            <Suspense>{children}</Suspense>
            <FeedbackWidget />
            <CookieNotice />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
