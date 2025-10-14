import { OrderWithRelations } from "../types/order";
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CreditCardIcon,
  UserIcon,
  NoSymbolIcon,
  TruckIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import ModalOrderItems from "../Modal/ModalOrderItems";
import { Tooltip } from "@nextui-org/react";

interface OrderTableRowProps {
  order: OrderWithRelations;
  onUpdate: (updatedOrder: OrderWithRelations) => void;
  onDelete: (id: string) => void;
  onEdit: (order: OrderWithRelations) => void;
  onDownload: (orderId: string) => void;
}

const OrderTableRow = ({
  order,
  onDelete,
  onEdit,
  onDownload,
}: OrderTableRowProps) => {
  const [showOrderItemsModal, setShowOrderItemsModal] = useState(false);

  return (
    <>
      <tr>
        <td className="px-6 py-4">{order.id}</td>
        <td className="px-6 py-4">{order.amountTTC}</td>
        <td className="px-6 py-4">{order.amountRefunded}</td>
        <td className="px-6 py-4">{order.amountCanceled}</td>
        <td className="px-6 py-4">{order.amountOrdered}</td>
        <td className="px-6 py-4">{order.amountShipped}</td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1">
            <TruckIcon className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <span
              className="max-w-[150px] truncate text-amber-700"
              title={order.shippingMethod || "No shipping method"}
            >
              {order.shippingMethod || "—"}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          {order.shippingAmount?.toFixed(2) || "0.00"}
        </td>
        <td className="px-6 py-4">{order.isActive ? "Yes" : "No"}</td>
        <td className="px-6 py-4">{order.fromMobile ? "Yes" : "No"}</td>
        <td className="px-6 py-4">{order.weight}</td>
        <td className="min-w-[180px] whitespace-nowrap px-6 py-4">
          {new Date(order.createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="min-w-[180px] whitespace-nowrap px-6 py-4">
          {new Date(order.updatedAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="px-6 py-4">{order.status?.name}</td>
        <td className="px-6 py-4">{order.state?.name}</td>
        <td className="whitespace-nowrap px-6 py-4">
          {order.customer ? (
            <div
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-blue-700"
              title={`${order.customer.firstName} ${order.customer.lastName}`}
            >
              <UserIcon className="h-4 w-4 flex-shrink-0" />
              <span className="max-w-[150px] truncate">
                {order.customer.firstName} {order.customer.lastName}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-gray-500">
              <NoSymbolIcon className="h-4 w-4 flex-shrink-0" />
              <span>N/A</span>
            </div>
          )}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {order.agent ? (
            <div
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-blue-700"
              title={`${order.agent.firstName} ${order.agent.lastName}`}
            >
              <UserIcon className="h-4 w-4 flex-shrink-0" />
              <span className="max-w-[150px] truncate">
                {order.agent.firstName} {order.agent.lastName}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-gray-500">
              <NoSymbolIcon className="h-4 w-4 flex-shrink-0" />
              <span>N/A</span>
            </div>
          )}
        </td>
        <td className="px-6 py-4">
          {order.comment ? (
            <Tooltip content={order.comment}>
              <div className="inline-flex max-w-full cursor-pointer items-center gap-2 overflow-hidden rounded-lg bg-gray-50 px-3 py-2 text-gray-700">
                <ChatBubbleBottomCenterTextIcon className="h-4 w-4 flex-shrink-0" />
                <span className="block max-w-[180px] truncate">
                  {order.comment}
                </span>
              </div>
            </Tooltip>
          ) : (
            <span className="text-gray-400">No comment</span>
          )}
        </td>
        <td className="min-w-[200px] px-4 py-4">
          {order.orderItems.length > 0 ? (
            <button
              className="flex items-center justify-center gap-1 whitespace-nowrap rounded bg-pink-50 px-3 py-2 text-pink-600 transition-colors hover:bg-pink-100 hover:underline"
              onClick={() => setShowOrderItemsModal(true)}
            >
              View Order Items ({order.orderItems.length})
            </button>
          ) : (
            <span className="text-gray-500">No Items</span>
          )}
        </td>
        <td className="min-w-[180px] whitespace-nowrap px-6 py-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700">
            <CreditCardIcon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate font-medium">
              {order.paymentMethod?.name || "N/A"}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(order)}
              className="text-gray-500 hover:text-blue-600"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(order.id)}
              className="text-gray-500 hover:text-red-600"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDownload(order.id)}
              className="text-gray-500 hover:text-green-600"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>

      {order.orderItems.length > 0 && (
        <ModalOrderItems
          isOpen={showOrderItemsModal}
          onClose={() => setShowOrderItemsModal(false)}
          orderItems={order.orderItems}
        />
      )}
    </>
  );
};

export default OrderTableRow;
