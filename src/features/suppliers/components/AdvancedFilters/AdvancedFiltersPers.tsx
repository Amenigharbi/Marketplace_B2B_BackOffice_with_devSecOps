import { useState } from "react";
import { FunnelIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";

const AdvancedFilters = ({ onApply }: { onApply: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    deliveryDateStart: "",
    deliveryDateEnd: "",
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FunnelIcon className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-700">
          Advanced Filters
        </h3>
      </div>

      <div className="relative">
        {/* Payment Method */}
        <div className="relative">
          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              setFilters({ ...filters, paymentMethod: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 bg-white p-2 pl-8 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Payment Methods</option>
            <option value="CHEQUE">Cheque</option>
            <option value="TRAITE">Traite</option>
            <option value="CASH">Cash</option>
          </select>
          <CreditCardIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
        </div>

        {/* Date Range - Start Date */}
        <div className="relative">
          <label htmlFor="deliveryDateStart" className="text-sm text-gray-600">
            Start Date
          </label>
          <input
            id="deliveryDateStart"
            type="date"
            className="w-full rounded-md border border-gray-300 p-2 pl-8 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) =>
              setFilters({ ...filters, deliveryDateStart: e.target.value })
            }
          />
        </div>

        {/* Date Range - End Date */}
        <div className="relative">
          <label htmlFor="deliveryDateEnd" className="text-sm text-gray-600">
            End Date
          </label>
          <input
            id="deliveryDateEnd"
            type="date"
            className="w-full rounded-md border border-gray-300 p-2 pl-8 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) =>
              setFilters({ ...filters, deliveryDateEnd: e.target.value })
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
