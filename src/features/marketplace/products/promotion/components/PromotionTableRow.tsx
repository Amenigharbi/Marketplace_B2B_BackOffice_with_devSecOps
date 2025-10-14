import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Promotion } from "../types/promo";
import { downloadPromoPDF } from "../utils/pdfUtils";

const PromoTableRow = ({
  promotion,
  onDelete,
  onEdit,
}: {
  promotion: Promotion;
  onUpdate: (updatedPromotion: Promotion) => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (promotion: Promotion) => void;
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const handleDownloadPDF = () => {
    downloadPromoPDF([promotion]);
  };

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          {promotion.id}
        </td>

        <td className="min-w-[120px] px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {promotion.promoPrice} DT
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {formatDate(promotion.startDate)}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {formatDate(promotion.endDate)}
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(promotion)}
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
              onClick={() => onDelete(promotion.id)}
              className="p-1 text-gray-400 transition-colors hover:text-red-600"
              aria-label="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default PromoTableRow;
