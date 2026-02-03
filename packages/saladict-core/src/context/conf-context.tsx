import { createContext, useContext, useState, ReactNode } from "react";

interface CalendarContextType {
  // Date management
  appDisable: boolean;

  // Etiquette visibility management
  visibleColors: string[];
  toggleColorVisibility: (color: string) => void;
  isColorVisible: (color: string | undefined) => boolean;
}

const ConfContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export function useConfContext() {
  const context = useContext(ConfContext);
  if (context === undefined) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider",
    );
  }
  return context;
}

interface CalendarProviderProps {
  children: ReactNode;
}

export function ConfProvider({ children }: CalendarProviderProps) {

  // Initialize visibleColors based on the isActive property in etiquettes
  const [visibleColors, setVisibleColors] = useState<string[]>([]);

  // Toggle visibility of a color
  const toggleColorVisibility = (color: string) => {
    setVisibleColors([]);
  };

  // Check if a color is visible
  const isColorVisible = (color: string | undefined) => {
    if (!color) return true; // Events without a color are always visible
    return visibleColors.includes(color);
  };

  const value:CalendarContextType = {
    appDisable:false,
    visibleColors,
    toggleColorVisibility,
    isColorVisible,
  };

  return (
    <ConfContext.Provider value={value}>
      {children}
    </ConfContext.Provider>
  );
}
