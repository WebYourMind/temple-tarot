"use client";

import CookieConsent from "react-cookie-consent";

function CookieNotice() {
  return (
    <CookieConsent
      disableStyles
      containerClasses="w-full bg-background fixed flex justify-between items center z-50 p-4 border-t"
      contentClasses="flex items-center"
      buttonClasses="bg-gradient-to-r from-cyan-500 to-blue-600 text-primary-foreground md:hover:brightness-125 transition duration-300 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  );
}

export default CookieNotice;
