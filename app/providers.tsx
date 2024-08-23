"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { FeedbackDataProvider } from "./feedback-data";
import { TarotSessionsProvider } from "lib/contexts/tarot-sessions-context";
import { UserAccessPlanProvider } from "./(payments)/(frontend)/contexts/user-access-plan-context";
import { TarotFlowProvider } from "lib/contexts/tarot-flow-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <SessionProvider>
        <TooltipProvider>
          <TarotFlowProvider>
            <UserAccessPlanProvider>
              <FeedbackDataProvider>
                <TarotSessionsProvider>{children}</TarotSessionsProvider>
              </FeedbackDataProvider>
            </UserAccessPlanProvider>
          </TarotFlowProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
