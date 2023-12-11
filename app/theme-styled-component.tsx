import { useTheme } from "./theme";
import appConfig from "app.config";
import { CSSProperties, useEffect } from "react";

export function ThemeStyledComponent({ children }: { children: React.ReactNode }) {
  const { themeMode } = useTheme() as { themeMode: "light" | "dark" };
  const theme = appConfig.theme.modes[themeMode];
  const themeStyle: CSSProperties = {
    "--color-primary": theme.primary,
    "--color-background": theme.background,
    "--color-foreground": theme.foreground,
    "--color-card": theme.card,
    "--color-card-foreground": theme.cardForeground,
    "--color-popover": theme.popover,
    "--color-popover-foreground": theme.popoverForeground,
    "--color-primary-foreground": theme.primaryForeground,
    "--color-secondary": theme.secondary,
    "--color-secondary-foreground": theme.secondaryForeground,
    "--color-muted": theme.muted,
    "--color-muted-foreground": theme.mutedForeground,
    "--color-accent": theme.accent,
    "--color-accent-foreground": theme.accentForeground,
    "--color-destructive": theme.destructive,
    "--color-destructive-foreground": theme.destructiveForeground,
    "--color-border": theme.border,
    "--color-input": theme.input,
    "--color-ring": theme.ring,
    "--radius": theme.radius,
  } as React.CSSProperties;

  useEffect(() => {
    Object.entries(themeStyle).forEach(([key, value]) => {
      if (typeof value === "string") {
        document.body.style.setProperty(key, value);
      }
    });

    return () => {
      Object.keys(themeStyle).forEach((key) => {
        document.body.style.removeProperty(key);
      });
    };
  }, [themeMode]);

  return <div style={themeStyle}>{children}</div>;
}
