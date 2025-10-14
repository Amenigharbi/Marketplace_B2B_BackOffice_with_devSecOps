"use client";
import { createContext, useContext, useEffect, useState } from "react";
interface LayoutContextType {
  layout: string;
  changeLayout: (newLayout: string) => void;
  dir: string;
  changeDir: (newDir: string) => void;
}
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dir") || "ltr";
    } else {
      return "ltr";
    }
  });
  const [layout, setLayout] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("layout") || "Vertical";
    } else {
      return "Vertical";
    }
  });
  const changeDir = (newDir: string) => {
    setDir(newDir);
    localStorage.setItem("dir", newDir);
  };

  const changeLayout = (newLayout: string) => {
    setLayout(newLayout);
    localStorage.setItem("layout", newLayout);
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);
  if (!mounted) {
    return null;
  }

  return (
    <LayoutContext.Provider value={{ layout, changeLayout, dir, changeDir }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
