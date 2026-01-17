'use client';

import React, { createContext, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode } from '../../redux/theme/themeSlice';
import type { RootState } from '../../redux/store';

// Define the shape of the context
interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create context with default values matching the type
export const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: true,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  
  // Select strongly typed state
  const darkMode = useSelector((state: RootState) => state.themeSlice.darkMode);

  useEffect(() => {
    // This logic runs only in the browser
    const themeColor = document.querySelector("meta[name='theme-color']");

    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
      document.documentElement.style.setProperty('background-color', '#000000');
      themeColor?.setAttribute('content', '#000000');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
      document.documentElement.style.setProperty('background-color', '#F5F5F5');
      themeColor?.setAttribute('content', '#F5F5F5');
    }
  }, [darkMode]);

  const value = useMemo(
    () => ({
      darkMode,
      toggleDarkMode: () => dispatch(setDarkMode(!darkMode)),
    }),
    [darkMode, dispatch],
  );

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};