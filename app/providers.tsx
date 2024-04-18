"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { FeedbackDataProvider } from "./feedback-data";
import { ReadingsProvider } from "lib/contexts/readings-context";
// import { CreditProvider } from "lib/contexts/credit-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <TooltipProvider>
          {/* <CreditProvider> */}
          <FeedbackDataProvider>
            <ReadingsProvider>{children}</ReadingsProvider>
          </FeedbackDataProvider>
          {/* </CreditProvider> */}
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
