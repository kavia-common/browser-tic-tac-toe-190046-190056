import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * ThemeContext provides current theme 'light' | 'dark' and functions to toggle/set theme.
 */
const ThemeContext = createContext({
  theme: 'light',
  // PUBLIC_INTERFACE
  toggleTheme: () => {},
  // PUBLIC_INTERFACE
  setTheme: (_t) => {}
});

const THEME_STORAGE_KEY = 'theme-preference';

// Determine preferred theme from localStorage or system setting
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (_) {
    // ignore storage errors
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  /**
   * PUBLIC_INTERFACE
   * Manages theme state and synchronizes it to :root[data-theme], and localStorage.
   */
  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply theme attribute to the root element for CSS variables and persist choice
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_) {
      // ignore storage errors
    }
  }, [theme]);

  // Respond to system theme changes only if user hasn't explicitly chosen
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      // Only update automatically if no explicit preference saved
      try {
        const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (!saved) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      } catch {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    if (media.addEventListener) {
      media.addEventListener('change', onChange);
    } else {
      media.addListener(onChange);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', onChange);
      } else {
        media.removeListener(onChange);
      }
    };
  }, []);

  // PUBLIC_INTERFACE
  const setTheme = (next) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore storage
    }
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Hook to access the theme context. Returns { theme, toggleTheme, setTheme } */
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
