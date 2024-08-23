"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { FeedbackDataProvider } from "./feedback-data";
import { ReadingsProvider } from "lib/contexts/readings-context";
import { UserAccessPlanProvider } from "./(payments)/(frontend)/contexts/user-access-plan-context";
import { TarotSessionProvider } from "lib/contexts/tarot-session-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <SessionProvider>
        <TooltipProvider>
          <TarotSessionProvider>
            <UserAccessPlanProvider>
              <FeedbackDataProvider>
                <ReadingsProvider>{children}</ReadingsProvider>
              </FeedbackDataProvider>
            </UserAccessPlanProvider>
          </TarotSessionProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
