"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "components/ui/tooltip";
import { ThemeProvider } from "./theme";
import { ThemeStyledComponent } from "./theme-styled-component";
import { FeedbackDataProvider } from "./feedback-data";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <TooltipProvider>
          <FeedbackDataProvider>
            <ThemeStyledComponent>{children}</ThemeStyledComponent>
          </FeedbackDataProvider>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
