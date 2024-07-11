"use client";

import CookieConsent from "react-cookie-consent";
import { buttonVariants } from "./ui/button";

function CookieNotice() {
  return (
    <CookieConsent
      disableStyles
      containerClasses="w-full bg-white/50 dark:bg-black/50 backdrop-blur-md fixed flex flex-col md:flex-row justify-between space-y-2 md:items-center z-50 p-4 border-t text-center md:text-start"
      contentClasses="flex items-center"
      buttonClasses={buttonVariants()}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  );
}

export default CookieNotice;
