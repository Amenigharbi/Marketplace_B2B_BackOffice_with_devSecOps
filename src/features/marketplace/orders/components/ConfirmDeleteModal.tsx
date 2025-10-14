import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay avec flou */}
      <div className="fixed inset-0 z-40 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-lg font-bold">Confirm Delete</h2>
          <p className="mt-2">Are you sure you want to delete this order?</p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;
