import { useState } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";

const AdvancedFilters = ({ onApply }: { onApply: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FunnelIcon className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-700">
          Advanced Filters
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="relative">
          <label htmlFor="startDate" className="text-sm text-gray-600">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            className="w-full rounded-md border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        {/* End Date */}
        <div className="relative">
          <label htmlFor="endDate" className="text-sm text-gray-600">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            className="w-full rounded-md border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onApply(filters)}
          className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters;
