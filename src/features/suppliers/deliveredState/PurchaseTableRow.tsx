import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  ArchiveBoxIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseOrder } from "../components/types/purchaseOrder";

type PurchaseOrderStatus = "IN_PROGRESS" | "READY" | "DELIVERED" | "COMPLETED";

const generatePDF = (order: PurchaseOrder) => {
  const doc = new jsPDF();
  doc.text(`Order #${order.orderNumber}`, 10, 10);
  const paymentsList = order.payments
    .map(
      (payment) =>
        `${payment.paymentMethod
          .replace(/_/g, " ")
          .toLowerCase()}: ${payment.amount.toFixed(2)} DT`,
    )
    .join(", ");

  autoTable(doc, {
    head: [["Field", "Value"]],
    body: [
      ["Supplier", order.manufacturer?.companyName || "N/A"],
      ["Warehouse", order.warehouse?.name || "N/A"],
      ["Delivery Date", format(order.deliveryDate, "dd/MM/yyyy")],
      ["Total Amount", `${order.totalAmount.toFixed(2)} DT`],
      ["Status", order.status.replace(/_/g, " ").toLowerCase()],
      ["Payments", paymentsList || "No payments"],
    ],
  });

  doc.save(`order-${order.orderNumber}.pdf`);
};

const handleDownloadPDF = (order: PurchaseOrder) => {
  generatePDF(order);
};

const paymentMethodColors: Record<string, string> = {
  CHEQUE: "bg-indigo-100 text-indigo-800",
  TRAITE: "bg-cyan-100 text-cyan-800",
  CASH: "bg-emerald-100 text-emerald-800",
};

const statusStyles: Record<
  PurchaseOrderStatus,
  { bg: string; text: string; icon: any }
> = {
  IN_PROGRESS: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: ClockIcon,
  },
  READY: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: ArchiveBoxIcon,
  },
  DELIVERED: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: TruckIcon,
  },
  COMPLETED: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: CheckCircleIcon,
  },
};

const PurchaseTableRow = ({ order }: { order: PurchaseOrder }) => {
  const StatusIcon = statusStyles[order.status].icon;

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50">
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          <span className="font-mono">#{order.orderNumber}</span>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">
            {order.manufacturer?.companyName || "N/A"}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm text-gray-600">
            {order.warehouse?.name || "N/A"}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm text-gray-600">
            {format(new Date(order.deliveryDate), "dd MMM yyyy", {
              locale: enUS,
            })}
          </div>
        </td>

        <td className="px-6 py-4">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
              statusStyles[order.status].bg
            } ${statusStyles[order.status].text}`}
          >
            <StatusIcon className="h-4 w-4" />
            <span className="text-xs font-medium capitalize">
              {order.status.replace(/_/g, " ").toLowerCase()}
            </span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm font-semibold text-gray-900">
            {order.totalAmount.toFixed(2)} DT
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {order.payments.map((payment, index) => (
              <span
                key={index}
                className={`rounded-full px-2.5 py-1 text-xs ${
                  paymentMethodColors[payment.paymentMethod]
                }`}
              >
                {payment.paymentMethod.replace(/_/g, " ").toLowerCase()}
              </span>
            ))}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownloadPDF(order)}
              className="p-1 text-gray-400 transition-colors hover:text-red-600"
              aria-label="Download PDF"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default PurchaseTableRow;
