import {
  IconX,
  IconReceipt,
  IconCheckbox,
  IconClipboardList,
} from "@tabler/icons-react";

interface OrderStatusChangedModalProps {
  data: {
    orderId?: string;
    state?: string;
    status?: string;
  };
  onClose: () => void;
}

export function OrderStatusChangedModal({
  data,
  onClose,
}: OrderStatusChangedModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b bg-blue-50 p-4">
          <h2 className="text-lg font-semibold text-blue-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-blue-500 transition-colors hover:text-blue-700"
          >
            <IconX className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-50 p-3">
              <IconReceipt className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium text-gray-900">
                {data?.orderId || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-50 p-3">
              <IconCheckbox className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p className="font-medium text-gray-900">
                {data?.state || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-purple-50 p-3">
              <IconClipboardList className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-900">
                {data?.status || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
