"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "components/ui/tooltip";
import { ThemeProvider } from "./theme";
import { ThemeStyledComponent } from "./theme-styled-component";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <TooltipProvider>
          <ThemeStyledComponent>{children}</ThemeStyledComponent>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
