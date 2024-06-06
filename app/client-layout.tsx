"use client";
import CookieNotice from "components/cookie-notice";
import dynamic from "next/dynamic";

import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const Header = dynamic(() => import("../components/navigation/header"), {
  ssr: false,
});

const FeedbackWidget = dynamic(() => import("../components/feedback/feedback-widget"), {
  ssr: false,
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname === "/interpretation" || pathname.includes("/readings/");
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Toaster />
      {!hideHeader && <Header />}
      <Suspense>{children}</Suspense>
      <FeedbackWidget />
      <CookieNotice />
    </div>
  );
}
