import React from "react";
import { Reservation } from "../types/reservation";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reservation: Reservation | null;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  reservation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Confirm Deletion
        </h2>

        {reservation && (
          <div className="mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Customer:</span>
              <span>
                {reservation.customer?.firstName}{" "}
                {reservation.customer?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Amount:</span>
              <span>{reservation.amountTTC} DT</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Items:</span>
              <span>{reservation.reservationItems.length} item(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Status:</span>
              <span
                className={
                  reservation.isActive ? "text-green-600" : "text-gray-600"
                }
              >
                {reservation.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        )}

        <p className="mb-6 text-gray-700">
          Are you sure you want to permanently delete this reservation? This
          action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            disabled={reservation?.isActive}
            title={
              reservation?.isActive
                ? "Active reservations cannot be deleted"
                : ""
            }
          >
            Delete Reservation
          </button>
        </div>

        {reservation?.isActive && (
          <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-yellow-700">
            ⚠️ Active reservations cannot be deleted. Please deactivate first.
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
