import { ReactNode, createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({ themeMode: "dark", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize themeMode from local storage or default to 'dark'
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("themeMode");
      return savedTheme || "dark";
    }
    return "dark";
  });

  // Update local storage whenever themeMode changes
  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((currentMode) => (currentMode === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ themeMode, toggleTheme }}>{children}</ThemeContext.Provider>;
}
