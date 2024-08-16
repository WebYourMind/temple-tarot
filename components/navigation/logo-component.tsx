"use client";
import Image from "next/image";
// import Logo from "app/logo.png";
import Logo2 from "public/icons/android-chrome-192x192.png";
import appConfig from "app.config";
import { cn } from "lib/utils";
import { MagicFont } from "components/tarot-session/query/query-input";

export default function LogoComponent() {
  return (
    <div className="flex w-full items-center justify-start md:px-2">
      <Image src={Logo2} width={40} height={40} alt="Temple Tarot" className="mr-1 h-8 w-8 rounded-full shadow-sm" />
      <h1 className={cn("my-4 text-xl", MagicFont.className)}>{appConfig.appName}</h1>
    </div>
  );
  // return <Image src={Logo} width={200} height={100} alt="Temple Tarot" />;
}
