import { useSearchBar } from "./useSearchBar";
import { IconSearch } from "@tabler/icons-react";
import { forwardRef, useImperativeHandle } from "react";

export type searchRef = {
  reset: () => void;
};

// eslint-disable-next-line react/display-name
const SearchBar = forwardRef<searchRef, any>(
  ({ onSearch = (item: string) => {}, isWithInstantSearch = false }, ref) => {
    const { handleSubmit, handleInputChange, reset, text } = useSearchBar(
      isWithInstantSearch,
      onSearch,
    );

    useImperativeHandle(ref, () => ({
      reset: () => {
        reset();
      },
    }));

    return (
      <div className="relative w-full sm:w-auto sm:min-w-[200px] sm:flex-1">
        <input
          type="text"
          value={text}
          placeholder="Search"
          onChange={handleInputChange}
          className="w-full rounded-lg border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          🔍
        </span>
      </div>
    );
  },
);
export default SearchBar;
