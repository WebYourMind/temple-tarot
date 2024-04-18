"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "components/ui/tooltip";
import { ThemeProvider } from "./theme";
import { FeedbackDataProvider } from "./feedback-data";
// import { CreditProvider } from "lib/contexts/credit-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <TooltipProvider>
          {/* <CreditProvider> */}
          <FeedbackDataProvider>{children}</FeedbackDataProvider>
          {/* </CreditProvider> */}
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
