"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { FeedbackDataProvider } from "./feedback-data";
import { ReadingsProvider } from "lib/contexts/readings-context";
import { CreditProvider } from "app/(ai-payments)/(frontend)/contexts/credit-context";
import { LumenProvider } from "lib/contexts/lumen-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <TooltipProvider>
          <CreditProvider>
            <LumenProvider>
              <FeedbackDataProvider>
                <ReadingsProvider>{children}</ReadingsProvider>
              </FeedbackDataProvider>
            </LumenProvider>
          </CreditProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
