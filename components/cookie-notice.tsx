"use client";

import CookieConsent from "react-cookie-consent";
import { buttonVariants } from "./ui/button";

function CookieNotice() {
  return (
    <CookieConsent
      disableStyles
      containerClasses="w-full bg-background fixed flex justify-between items center z-50 p-4 border-t"
      contentClasses="flex items-center"
      buttonClasses={buttonVariants()}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  );
}

export default CookieNotice;
