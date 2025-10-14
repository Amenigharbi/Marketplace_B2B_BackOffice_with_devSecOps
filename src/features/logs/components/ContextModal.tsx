import { IconUser, IconShoppingCart, IconX } from "@tabler/icons-react";

interface ModalProps {
  data: any;
  onClose: () => void;
}

export default function ContextModal({ data, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-gray-50 shadow-xl">
        {/* En-tête du modal */}
        <div className="flex items-center justify-between border-b bg-blue-50 p-4">
          <h2 className="text-lg font-semibold text-blue-800">
            Détails du contexte
          </h2>
          <button
            onClick={onClose}
            className="text-blue-500 transition-colors hover:text-blue-700"
          >
            <IconX className="h-6 w-6" />
          </button>
        </div>

        {/* Corps du modal */}
        <div className="space-y-4 p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-red-50 p-3">
              <IconUser className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-700">User ID</p>
              <p className="font-medium text-gray-800">
                {data?.userId || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-yellow-50 p-3">
              <IconUser className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-700">Username</p>
              <p className="font-medium text-gray-800">
                {data?.username || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-pink-50 p-3">
              <IconShoppingCart className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <p className="text-sm text-gray-700">Store ID</p>
              <p className="font-medium text-gray-800">
                {data?.storeId || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
