import { Reservation } from "../types/reservation";
import { downloadReservationPDF } from "../utils/pdfUtils";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal/modal";
import EditReservationModal from "./EditReservationModal";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import {
  TrashIcon,
  ArrowDownTrayIcon,
  CreditCardIcon,
  UserIcon,
  NoSymbolIcon,
  TruckIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type ReservationTableRowProps = {
  reservation: Reservation;
  onDelete: (id: string) => Promise<void>;
};

const UserInfoCell = ({
  user,
  label,
}: {
  user?: { firstName?: string; lastName?: string };
  label: string;
}) => (
  <td className="whitespace-nowrap px-6 py-4">
    {user ? (
      <div
        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-blue-700"
        title={`${user.firstName} ${user.lastName}`}
      >
        <UserIcon className="h-4 w-4 flex-shrink-0" />
        <span className="max-w-[150px] truncate">
          {user.firstName} {user.lastName}
        </span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-gray-500">
        <NoSymbolIcon className="h-4 w-4 flex-shrink-0" />
        <span>{label}</span>
      </div>
    )}
  </td>
);
const isNumber = (value: unknown): value is number => typeof value === "number";

const StatusBadge = ({ value, label }: { value: number; label: string }) => (
  <td className="min-w-[150px] px-6 py-4 text-sm text-gray-900">
    <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1">
      <TruckIcon className="h-4 w-4 text-amber-600" />
      <span className="max-w-[150px] truncate text-amber-700" title={label}>
        {label || "—"}
      </span>
    </div>
  </td>
);

const formatDate = (date: Date) => new Date(date).toLocaleDateString("fr-FR");

const ReservationTableRow = ({
  reservation,
  onDelete,
}: ReservationTableRowProps) => {
  const { setNotifications } = useGlobalStore();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleDownloadPDF = () => downloadReservationPDF([reservation]);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const toggleCommentExpansion = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleSaveReservation = async (updatedReservation: Reservation) => {
    try {
      if (
        updatedReservation.isActive === false &&
        reservation.isActive === true
      ) {
        toast.error("Unable to deactivate an active reservation");
        return;
      }
      const updateResponse = await fetch(
        `/api/marketplace/reservation/${updatedReservation.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedReservation),
        },
      );

      if (!updateResponse.ok) {
        throw new Error(await updateResponse.text());
      }

      const result = await updateResponse.json();

      // Ajouter la notification au store global
      if (result.notification) {
        setNotifications(result.notification);
      }

      toast.success("Reservation updated successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <tr className="transition-colors duration-150 hover:bg-gray-50">
        {/* ID Column */}
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          #{reservation.id}
        </td>

        {["amountTTC", "amountOrdered"].map((field) => {
          const value = reservation[field as keyof Reservation];
          return (
            <td key={field} className="px-6 py-4 text-sm text-gray-900">
              {isNumber(value) ? `${value} DT` : "N/A"}
            </td>
          );
        })}

        <StatusBadge
          value={reservation.amountOrdered}
          label={reservation.shippingMethod}
        />
        <td className="px-6 py-4 text-sm text-gray-900">
          {isNumber(reservation.shippingAmount)
            ? `${reservation.shippingAmount} DT`
            : "N/A"}
        </td>

        {/* Status Columns */}
        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.isActive ? "Active" : "Inactive"}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.fromMobile ? "Yes" : "No"}
        </td>

        <td className="px-6 py-4 text-sm text-gray-900">
          {reservation.weight}
        </td>

        {/* User Info Columns */}
        <UserInfoCell user={reservation.customer} label="N/A" />

        {/* Payment Method */}
        <td className="min-w-[180px] whitespace-nowrap px-6 py-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700">
            <CreditCardIcon className="h-5 w-5" />
            <span className="truncate font-medium">
              {reservation.paymentMethod.name}
            </span>
          </div>
        </td>

        {/* Dates */}
        <td className="px-8 py-4 text-sm text-gray-900">
          {formatDate(reservation.createdAt)}
        </td>
        <td className="px-8 py-4 text-sm text-gray-900">
          {formatDate(reservation.updatedAt)}
        </td>

        {/* Items Button */}
        <td className="min-w-[200px] px-4 py-4">
          <button
            className="flex w-full items-center justify-center gap-1 rounded bg-pink-50 px-4 py-2 text-pink-600 transition-colors hover:bg-pink-100 hover:underline"
            onClick={() => setShowModal(true)}
          >
            View Items ({reservation.reservationItems.length})
          </button>
        </td>
        <td className="max-w-[300px] overflow-hidden px-6 py-4 text-sm text-gray-900">
          {reservation.comment ? (
            <div className="group relative z-0">
              <div
                className={`transition-all duration-150 ${
                  expandedComments[reservation.id] ? "" : "line-clamp-2"
                } break-words pr-5`}
              >
                {reservation.comment}
              </div>

              {reservation.comment.length > 60 && (
                <button
                  className={`absolute bottom-0 right-0 text-xs ${
                    expandedComments[reservation.id]
                      ? "text-blue-600"
                      : "text-blue-500 group-hover:text-blue-600"
                  } rounded bg-white px-1 transition-colors hover:bg-blue-50`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCommentExpansion(reservation.id);
                  }}
                  aria-expanded={expandedComments[reservation.id]}
                  aria-label={
                    expandedComments[reservation.id]
                      ? "Collapse comment"
                      : "Expand comment"
                  }
                >
                  {expandedComments[reservation.id] ? (
                    <ChevronUpIcon className="h-3 w-3" />
                  ) : (
                    <ChevronDownIcon className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>
          ) : (
            <span className="italic text-gray-400">no comment</span>
          )}
        </td>

        {/* Action Buttons */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <ActionButton
              icon={PencilSquareIcon}
              onClick={() => setShowEditModal(true)}
              color="yellow"
              ariaLabel="Edit"
            />
            <ActionButton
              icon={TrashIcon}
              onClick={() => onDelete(reservation.id)}
              color="red"
              ariaLabel="Delete"
            />
            <ActionButton
              icon={ArrowDownTrayIcon}
              onClick={handleDownloadPDF}
              color="blue"
              ariaLabel="Download PDF"
            />
          </div>
        </td>
      </tr>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        items={reservation.reservationItems}
      />

      <EditReservationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        reservation={reservation}
        onSave={handleSaveReservation}
      />
    </>
  );
};

const ActionButton = ({
  icon: Icon,
  onClick,
  color,
  ariaLabel,
}: {
  icon: React.ElementType;
  onClick: () => void;
  color: string;
  ariaLabel: string;
}) => (
  <button
    onClick={onClick}
    className={`p-1 text-gray-400 transition-colors hover:text-${color}-600`}
    aria-label={ariaLabel}
  >
    <Icon className="h-5 w-5" />
  </button>
);

export default ReservationTableRow;
