import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import EditTaxForm from "./EditTaxForm";
import { Tax } from "../types/tax";
import { downloadTaxPDF } from "../utils/pdfUtils";
const TaxTableRow = ({
  tax,
  onUpdate,
  onDelete,
}: {
  tax: Tax;
  onUpdate: (updatedTax: Tax) => void;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleDownloadPDF = () => {
    downloadTaxPDF([tax]);
  };
  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          {tax.id}
        </td>

        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{tax.value}%</div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 transition-colors hover:text-blue-600"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>

            <button
              onClick={() => handleDownloadPDF()}
              className="p-1 text-gray-400 transition-colors hover:text-green-600"
              aria-label="Download PDF"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(tax.id)}
              className="p-1 text-gray-400 transition-colors hover:text-red-600"
              aria-label="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>

      {isEditing && (
        <EditTaxForm
          tax={tax}
          onClose={() => setIsEditing(false)}
          onUpdate={(updatedTax) => {
            onUpdate(updatedTax);
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
};

export default TaxTableRow;
