"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { FeedbackDataProvider } from "./feedback-data";
import { ReadingsProvider } from "lib/contexts/readings-context";
import { UserAccessPlanProvider } from "./(ai-payments)/(frontend)/contexts/user-access-plan-context";
// import { LumenProvider } from "lib/contexts/lumen-context";
import { TarotSessionProvider } from "lib/contexts/tarot-session-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <TooltipProvider>
          <TarotSessionProvider>
            <UserAccessPlanProvider>
              {/* <LumenProvider> */}
              <FeedbackDataProvider>
                <ReadingsProvider>{children}</ReadingsProvider>
              </FeedbackDataProvider>
              {/* </LumenProvider> */}
            </UserAccessPlanProvider>
          </TarotSessionProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
