import { useEffect, useState } from "react";

export const useSearchBar = (
  isWithInstantSearch: boolean,
  onSearch: (term: string) => void,
) => {
  const [text, setText] = useState("");

  const reset = () => setText("");

  const handleSubmit = () => {
    !isWithInstantSearch && onSearch && onSearch(text);
  };

  const handleInputChange = (e: any) => {
    setText(e.target?.value);
  };
  useEffect(() => {
    if (isWithInstantSearch) {
      const timer = setTimeout(() => {
        onSearch && onSearch(text);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [text, onSearch, isWithInstantSearch]);

  return {
    handleSubmit,
    handleInputChange,
    reset,
    text,
  };
};
