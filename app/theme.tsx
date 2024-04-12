import { ReactNode, createContext, useContext, useState, useLayoutEffect } from "react";

const ThemeContext = createContext({ themeMode: "light", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Function to update theme on the document body
  const updateTheme = (theme: string) => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  // Initialize themeMode from local storage or default based on system preference
  const [themeMode, setThemeMode] = useState(() => {
    // Check for server-side rendering
    if (typeof window !== "undefined") {
      const savedTheme =
        localStorage.getItem("themeMode") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      updateTheme(savedTheme); // Update theme immediately on load based on saved preference or system preference
      return savedTheme;
    }
    return "light"; // Default theme if server-side rendering
  });

  // Effect to handle theme changes
  useLayoutEffect(() => {
    localStorage.setItem("themeMode", themeMode); // Save the current theme mode to localStorage
    updateTheme(themeMode); // Apply the current theme mode
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ themeMode, toggleTheme }}>{children}</ThemeContext.Provider>;
}
