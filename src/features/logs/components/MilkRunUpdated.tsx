import {
  IconX,
  IconTruck,
  IconClipboardList,
  IconUser,
  IconBuildingStore,
  IconCalendar,
  IconCheck,
} from "@tabler/icons-react";

interface MilkRunUpdatedModalProps {
  data: {
    orderId?: string;
    storeId?: string;
    agentId?: string;
    agentName?: string;
    deliveryDate?: string;
    status?: string;
  };
  onClose: () => void;
}

export function MilkRunUpdatedModal({
  data,
  onClose,
}: MilkRunUpdatedModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Milk Run Updated for Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            <IconX className="h-6 w-6" />
          </button>
        </div>

        {/* Corps */}
        <div className="space-y-4 p-6">
          {/* Order ID */}
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-50 p-3">
              <IconTruck className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium text-gray-900">
                {data?.orderId || " "}
              </p>
            </div>
          </div>

          {/* Store ID */}
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-indigo-50 p-3">
              <IconBuildingStore className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Store ID</p>
              <p className="font-medium text-gray-900">
                {data?.storeId || " "}
              </p>
            </div>
          </div>

          {/* Agent ID */}
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-yellow-50 p-3">
              <IconUser className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Agent ID</p>
              <p className="font-medium text-gray-900">
                {data?.agentId || " "}
              </p>
            </div>
          </div>

          {/* Agent Name */}
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-pink-50 p-3">
              <IconUser className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Agent Name</p>
              <p className="font-medium text-gray-900">
                {data?.agentName || " "}
              </p>
            </div>
          </div>

          {/* Delivery Date */}
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-50 p-3">
              <IconCalendar className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Date</p>
              <p className="font-medium text-gray-900">
                {data?.deliveryDate || " "}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-red-50 p-3">
              <IconCheck className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-900">{data?.status || " "}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
