import { useState } from "react";
import { OrderItemWithRelations } from "../types/order";

const EditOrderItemsForm = ({
  orderItems,
  onClose,
  onUpdate,
  isOpen,
}: {
  orderItems: OrderItemWithRelations[];
  onClose: () => void;
  onUpdate: (data: {
    updatedItems: OrderItemWithRelations[];
    amountRefunded: number;
    amountOrdered: number;
    amountShipped: number;
    amountCanceled: number;
  }) => void;
  isOpen: boolean;
}) => {
  const [updatedOrderItems, setUpdatedOrderItems] = useState<
    OrderItemWithRelations[]
  >([...orderItems]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleOrderItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...updatedOrderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setUpdatedOrderItems(updatedItems);
  };

  const getSourceName = (item: OrderItemWithRelations) => {
    return item.source?.name || "Unknown Source";
  };

  const getPartnerName = (item: OrderItemWithRelations) => {
    return (
      item.partner?.username ||
      (item.partner?.firstName && item.partner?.lastName
        ? `${item.partner.firstName} ${item.partner.lastName}`
        : "Unknown Partner")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validation checks
    if (
      updatedOrderItems.some(
        (item) => item.qteOrdered < 0 || item.discountedPrice < 0,
      )
    ) {
      setError("Quantities and prices must be non-negative.");
      setIsSubmitting(false);
      return;
    }

    const invalidItemIndex = updatedOrderItems.findIndex(
      (item) =>
        item.qteCanceled + item.qteRefunded + item.qteShipped > item.qteOrdered,
    );

    if (invalidItemIndex !== -1) {
      setError(
        `Item ${
          invalidItemIndex + 1
        }: The sum of Canceled, Refunded and Shipped quantities cannot exceed Ordered quantity.`,
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const updates = updatedOrderItems.map((item) => ({
        id: item.id,
        qteOrdered: item.qteOrdered,
        qteRefunded: item.qteRefunded,
        qteShipped: item.qteShipped,
        qteCanceled: item.qteCanceled,
        discountedPrice: item.discountedPrice,
        weight: item.weight,
        sku: item.sku,
      }));

      const response = await fetch("/api/marketplace/order_items/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order items");
      }

      const totals = {
        amountRefunded: Number(
          updatedOrderItems
            .reduce(
              (sum, item) => sum + item.qteRefunded * item.discountedPrice,
              0,
            )
            .toFixed(3),
        ),
        amountOrdered: Number(
          updatedOrderItems
            .reduce(
              (sum, item) => sum + item.qteOrdered * item.discountedPrice,
              0,
            )
            .toFixed(3),
        ),
        amountShipped: Number(
          updatedOrderItems
            .reduce(
              (sum, item) => sum + item.qteShipped * item.discountedPrice,
              0,
            )
            .toFixed(3),
        ),
        amountCanceled: Number(
          updatedOrderItems
            .reduce(
              (sum, item) => sum + item.qteCanceled * item.discountedPrice,
              0,
            )
            .toFixed(3),
        ),
      };

      // Retourner les items mis à jour avec les totaux
      onUpdate({
        updatedItems: updatedOrderItems,
        ...totals,
      });
    } catch (error) {
      setError(`An error occurred: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="space-y-1 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Order Items
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Update quantities and prices for order items
          </p>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="space-y-6">
            {updatedOrderItems.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product?.name ||
                        item.productName ||
                        "Unknown product"}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Item {index + 1}
                      </span>
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Partner:</span>{" "}
                        {getPartnerName(item)}
                      </span>
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Source:</span>{" "}
                        {getSourceName(item)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2 sm:mt-0">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                      SKU: {item.sku}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Quantities Section */}
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                        Quantities
                      </h4>
                      <div className="flex items-center">
                        <div className="mx-2 h-px flex-1 bg-gray-200"></div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Ordered
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={item.qteOrdered}
                          onChange={(e) =>
                            handleOrderItemChange(
                              index,
                              "qteOrdered",
                              Number(e.target.value),
                            )
                          }
                          className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Shipped
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={item.qteShipped}
                          onChange={(e) =>
                            handleOrderItemChange(
                              index,
                              "qteShipped",
                              Number(e.target.value),
                            )
                          }
                          className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Refunded
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.qteRefunded}
                            onChange={(e) =>
                              handleOrderItemChange(
                                index,
                                "qteRefunded",
                                Number(e.target.value),
                              )
                            }
                            className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">
                            Canceled
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.qteCanceled}
                            onChange={(e) =>
                              handleOrderItemChange(
                                index,
                                "qteCanceled",
                                Number(e.target.value),
                              )
                            }
                            className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                        Pricing
                      </h4>
                      <div className="flex items-center">
                        <div className="mx-2 h-px flex-1 bg-gray-200"></div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Price (DT)
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-sm text-gray-500">DT</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.discountedPrice}
                          onChange={(e) =>
                            handleOrderItemChange(
                              index,
                              "discountedPrice",
                              Number(e.target.value),
                            )
                          }
                          className="block w-full rounded-md border-gray-300 py-2 pl-12 pr-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Subtotal
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-sm text-gray-500">DT</span>
                        </div>
                        <input
                          type="text"
                          readOnly
                          value={(
                            item.qteOrdered * item.discountedPrice
                          ).toFixed(2)}
                          className="block w-full rounded-md border-gray-300 bg-gray-100 py-2 pl-12 pr-3 text-sm text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Section */}
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                        Additional Info
                      </h4>
                      <div className="flex items-center">
                        <div className="mx-2 h-px flex-1 bg-gray-200"></div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Weight
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.weight}
                          onChange={(e) =>
                            handleOrderItemChange(
                              index,
                              "weight",
                              Number(e.target.value),
                            )
                          }
                          className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-sm text-gray-500">kg</span>
                        </div>
                      </div>
                    </div>

                    {item.deliveryDate && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Estimated Delivery
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="text"
                            readOnly
                            value={new Date(
                              item.deliveryDate,
                            ).toLocaleDateString()}
                            className="block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg
                  className="-ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderItemsForm;
