// useWindowSize.ts
import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<number | null>(null);

  const handleResize = () => {
    const width = window.innerWidth;
    setWindowSize(width);
  };

  useEffect(() => {
    // Initial setup
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { windowSize };
};
