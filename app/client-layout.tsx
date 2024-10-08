"use client";
import CookieNotice from "components/cookie-notice";
import dynamic from "next/dynamic";

import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { useTarotFlow } from "lib/contexts/tarot-flow-context";

const Header = dynamic(() => import("../components/navigation/header"), {
  ssr: false,
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { phase } = useTarotFlow();
  const hideHeader =
    phase === "reading" || (pathname && (pathname === "/interpretation" || pathname.includes("/readings/")));
  return (
    <div className="relative flex h-full flex-col">
      <div
        className="bg-hero h-fill fixed bottom-0 left-0 right-0 top-0 -z-10 max-h-screen w-screen bg-cover bg-center bg-no-repeat
		text-foreground"
      >
        <div className="h-full min-h-screen w-full backdrop-blur-2xl backdrop-brightness-[1.2] md:backdrop-blur-2xl"></div>
      </div>
      <div className="h-fill flex grow flex-col md:min-h-screen">
        <Toaster />
        {!hideHeader && <Header />}
        {children}
        <CookieNotice />
      </div>
    </div>
  );
}
