import { useState } from "react";
import {
  IconX,
  IconEdit,
  IconCalendar,
  IconReceipt,
  IconClipboardList,
  IconChevronDown,
  IconChevronUp,
  IconBox,
} from "@tabler/icons-react";

interface OrderEditedModalProps {
  data: {
    orderId?: string;
    deliveryDate?: string;
    total?: number;
    items?: {
      updatedItems?: {
        productId: string;
        productName: string;
        sku: string;
        weight: number;
      }[];
      removedItems?: { productId: string; productName: string }[];
      addedItems?: { productId: string; productName: string }[];
    };
    status?: string;
  };
  onClose: () => void;
}

export function OrderEditedModal({ data, onClose }: OrderEditedModalProps) {
  const [showItems, setShowItems] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-800">Order Edited</h2>
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
            <IconReceipt className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium text-gray-900">{data?.orderId}</p>
            </div>
          </div>

          {/* Delivery Date */}
          <div className="flex items-center space-x-4">
            <IconCalendar className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Delivery Date</p>
              <p className="font-medium text-gray-900">{data?.deliveryDate}</p>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center space-x-4">
            <IconEdit className="h-6 w-6 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium text-gray-900">
                {data?.total ? `${data.total} DT` : ""}
              </p>
            </div>
          </div>

          {/* Items (Collapsible) */}
          <div className="rounded-lg border bg-gray-50 p-4">
            {" "}
            {/* Changed the background color here */}
            <button
              onClick={() => setShowItems(!showItems)}
              className="flex w-full justify-between font-medium text-gray-700"
            >
              <div className="flex items-center">
                <IconBox className="mr-2 h-6 w-6" />{" "}
                {/* Aligned the icon size */}
                <span>Items</span>
              </div>
              {showItems ? (
                <IconChevronUp className="h-5 w-5" />
              ) : (
                <IconChevronDown className="h-5 w-5" />
              )}
            </button>
            {showItems && (
              <div className="mt-3 max-h-48 space-y-3 overflow-y-auto rounded-md bg-white p-3">
                {/* Updated Items */}
                {data?.items?.updatedItems &&
                  data.items.updatedItems.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-700">
                        Updated Items:
                      </p>
                      <ul className="space-y-2">
                        {data.items.updatedItems.map((item, index) => (
                          <li key={index} className="text-sm text-gray-800">
                            <div>
                              <strong>Product Name:</strong> {item.productName}
                            </div>
                            <div>
                              <strong>Product ID:</strong> {item.productId}
                            </div>
                            <div>
                              <strong>SKU:</strong> {item.sku}
                            </div>
                            <div>
                              <strong>Weight:</strong>{" "}
                              {item.weight
                                ? `${item.weight} `
                                : "Not Available"}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Removed Items */}
                {data?.items?.removedItems &&
                  data.items.removedItems.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-700">
                        Removed Items:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-red-600">
                        {data.items.removedItems.map((item, index) => (
                          <li key={index}>{item.productName}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Added Items */}
                {data?.items?.addedItems &&
                  data.items.addedItems.length > 0 && (
                    <div>
                      <p className="font-semibold text-gray-700">
                        Added Items:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-green-600">
                        {data.items.addedItems.map((item, index) => (
                          <li key={index}>{item.productName}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center space-x-4">
            <IconClipboardList className="h-6 w-6 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-900">{data?.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
