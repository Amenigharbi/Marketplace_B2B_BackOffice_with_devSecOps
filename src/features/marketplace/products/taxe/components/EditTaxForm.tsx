import { useState } from "react";
import { Tax } from "../types/tax";

const EditTaxForm = ({
  tax,
  onClose,
  onUpdate,
}: {
  tax: Tax;
  onClose: () => void;
  onUpdate: (updatedTax: Tax) => void;
}) => {
  const [value, setValue] = useState<number>(tax.value);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    onUpdate({ ...tax, value });
    onClose();
  };

  return (
    <tr className="bg-blue-50">
      <td colSpan={3} className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              className={`w-full rounded-md border ${
                error ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500`}
              placeholder="Tax value (%)"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
};

export default EditTaxForm;
