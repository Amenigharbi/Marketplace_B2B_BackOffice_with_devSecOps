import React from "react";
import { ReservationItem } from "../types/reservation";
import {
  X,
  Package,
  Scale,
  Box,
  DollarSign,
  Store,
  Calendar,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReservationItem[];
}

interface PartnerGroup {
  partnerName: string;
  partnerId?: string;
  deliveryDate?: Date;
  items: ReservationItem[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  const itemsByPartner = items.reduce(
    (acc: Record<string, PartnerGroup>, item) => {
      const partnerKey = item.partnerId || "unknown";
      if (!acc[partnerKey]) {
        acc[partnerKey] = {
          partnerName: item.partner?.username || "Unknown Partner",
          partnerId: item.partnerId,
          deliveryDate: item.deliveryDate,
          items: [],
        };
      }
      acc[partnerKey].items.push(item);
      return acc;
    },
    {},
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-items-modal"
    >
      <div
        className={`w-[95%] max-w-2xl transform rounded-xl bg-white p-4 shadow-2xl transition-all duration-300 ease-out sm:w-[90%] md:p-6 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-indigo-600" />
            <div>
              <h2
                id="reservation-items-modal"
                className="text-xl font-bold text-gray-800 md:text-2xl"
              >
                Reserved Items Details
              </h2>
              <p className="text-sm text-gray-500">
                {items.length} {items.length > 1 ? "items" : "item"} across{" "}
                {Object.keys(itemsByPartner).length} partners
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(itemsByPartner).map(([partnerKey, group]) => (
            <div key={partnerKey} className="mb-6">
              <div className="mb-3 flex items-center space-x-2">
                <Store className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {group.partnerName}
                </h3>
              </div>
              {group.deliveryDate && (
                <div className="flex items-center space-x-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Delivery:{" "}
                    {new Date(group.deliveryDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              <ul className="space-y-4">
                {group.items.map((item) => {
                  const totalTTC =
                    item.price *
                    (1 + (item.taxValue || 0) / 100) *
                    item.qteReserved;
                  return (
                    <li
                      key={item.id}
                      className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <Box className="h-8 w-8" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:space-y-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.productName ?? "Unknown product"}
                            </h3>
                            <div className="flex space-x-2">
                              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                                SKU: {item.sku}
                              </span>

                              {item.source?.name && (
                                <span className="flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                                  Source: {item.source.name}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <div className="flex items-center rounded-lg bg-gray-50 p-2">
                              <DollarSign className="mr-2 h-4 w-4 text-indigo-500" />
                              <div>
                                <p className="text-xs text-gray-500">Price</p>
                                <p className="font-medium">
                                  {item.price != null
                                    ? item.price.toFixed(3)
                                    : "0.000"}{" "}
                                  DT
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center rounded-lg bg-blue-50 p-2">
                              <Package className="mr-2 h-4 w-4 text-blue-500" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Quantity
                                </p>
                                <p className="font-medium">
                                  {item.qteReserved}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center rounded-lg bg-purple-50 p-2">
                              <Scale className="mr-2 h-4 w-4 text-purple-500" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Total Weight
                                </p>
                                <p className="font-medium">
                                  {(item.weight * item.qteReserved).toFixed(2)}{" "}
                                  kg
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center rounded-lg bg-green-50 p-2">
                              <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Total (incl.taxes)
                                </p>
                                <p className="font-medium">
                                  {totalTTC.toFixed(3)} DT
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
