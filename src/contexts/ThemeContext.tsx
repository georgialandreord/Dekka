"use client"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type ThemeName =
  "ocean" | "forest" | "sunset" | "rose" | "slate" | "lavender" | "teal" | "amber" | "plum"

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app-theme") as ThemeName;
      return saved || "ocean";
    }
    return "ocean";
  });

  useEffect(() => {
    const root = document.documentElement;

    // Initialize dark mode from localStorage
    const savedThemeMode = localStorage.getItem("theme");
    if (
      savedThemeMode === "dark" ||
      (!savedThemeMode &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      // root.classList.add("dark");
      root.classList.remove("dark");
    } else {
      root.classList.remove("dark");
    }

    // Remove existing theme attributes
    root.removeAttribute("data-theme");

    // Apply new theme
    if (theme) {
      root.setAttribute("data-theme", theme);
    }

    // Save to localStorage
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
