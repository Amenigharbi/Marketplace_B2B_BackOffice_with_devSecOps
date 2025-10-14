import { useState, useEffect } from "react";
import { Reservation, ReservationItem } from "../types/reservation";
import {
  X,
  Package,
  Scale,
  Tag,
  Percent,
  CheckCircle,
  Users,
  DollarSign,
  Store,
  Box,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
interface PartnerGroup {
  partnerName: string;
  partnerId?: string;
  deliveryDate?: Date;
  items: ReservationItem[];
}
interface EditReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  onSave: (updatedReservation: Reservation) => Promise<void> | void;
}

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
  <h3 className="mb-6 flex items-center space-x-2 text-lg font-semibold text-gray-900">
    <span className="rounded-lg bg-blue-100 p-2">
      <Icon className="h-5 w-5 text-blue-600" />
    </span>
    <span>{title}</span>
  </h3>
);

const ReadOnlyField = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      readOnly
      value={value}
      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 shadow-sm"
    />
  </div>
);
const groupItemsByPartner = (
  items: ReservationItem[],
): Record<string, PartnerGroup> => {
  return items.reduce((acc: Record<string, PartnerGroup>, item) => {
    const partnerKey = item.partnerId || "unknown";
    if (!acc[partnerKey]) {
      acc[partnerKey] = {
        partnerName: item.partner?.username || "Unknown Partner",
        partnerId: item.partnerId,
        deliveryDate: item.deliveryDate
          ? new Date(item.deliveryDate)
          : undefined,
        items: [],
      };
    }
    acc[partnerKey].items.push(item);
    return acc;
  }, {});
};
const ReservationItemCard = ({ item }: { item: ReservationItem }) => {
  const totalTTC =
    item.price * (1 + (item.taxValue || 0) / 100) * item.qteReserved;

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:shadow-md">
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Box className="h-8 w-8" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">
              {item.productName ?? "Unknown product"}
            </h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                <Tag className="mr-1 h-3 w-3" />
                SKU: {item.sku}
              </div>
              {item.source?.name && (
                <div className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  <Store className="mr-1 h-3 w-3" />
                  {item.source.name}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center rounded-lg bg-gray-50 p-2">
              <DollarSign className="mr-2 h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-medium">
                  {item.price != null ? item.price.toFixed(3) : "0.000"} DT
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-lg bg-blue-50 p-2">
              <Package className="mr-2 h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="font-medium">{item.qteReserved}</p>
              </div>
            </div>
            <div className="flex items-center rounded-lg bg-purple-50 p-2">
              <Scale className="mr-2 h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Total Weight</p>
                <p className="font-medium">
                  {(item.weight * item.qteReserved).toFixed(2)} kg
                </p>
              </div>
            </div>
            <div className="flex items-center rounded-lg bg-green-50 p-2">
              <DollarSign className="mr-2 h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Total (incl. VAT)</p>
                <p className="font-medium">{totalTTC.toFixed(3)} DT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditReservationModal = ({
  isOpen,
  onClose,
  reservation,
  onSave,
}: EditReservationModalProps) => {
  const [editedReservation, setEditedReservation] = useState(reservation);
  const [isSaving, setIsSaving] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  const toggleCommentExpansion = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  useEffect(() => {
    setEditedReservation(reservation);
    setError(null);
    setFieldErrors({});
  }, [reservation]);

  const handleStatusChange = (value: string) => {
    setEditedReservation((prev) => ({ ...prev, isActive: value === "true" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      if (!editedReservation.customer) {
        throw {
          message: "Customer information is missing",
          fields: { customer: "Le client est requis." },
        };
      }

      await onSave(editedReservation);

      onClose();
    } catch (err: any) {
      console.error("Failed to save reservation:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors de l'enregistrement de la réservation.",
      );
      if (err.fields) {
        setFieldErrors(err.fields);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="my-8 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Reservation
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    ID: #{editedReservation.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
                aria-label="Close modal"
                disabled={isSaving}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-8 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          )}

          <div className="space-y-8 p-8">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowItems(!showItems)}
                className="flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-md"
              >
                <Package className="h-5 w-5" />
                <span>
                  {showItems
                    ? "Hide Items"
                    : `Show Items (${editedReservation.reservationItems.length})`}
                </span>
              </button>
            </div>

            {showItems && (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <SectionHeader icon={Tag} title="Reservation Items" />
                <div className="space-y-6">
                  {Object.entries(
                    groupItemsByPartner(editedReservation.reservationItems),
                  ).map(([partnerKey, group]) => (
                    <div key={partnerKey} className="space-y-4">
                      <div className="flex items-center space-x-3 border-b pb-2">
                        <Store className="h-5 w-5 text-indigo-500" />
                        <h4 className="text-md font-semibold text-gray-800">
                          {group.partnerName}
                        </h4>
                        {group.deliveryDate && (
                          <span className="ml-auto flex items-center space-x-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {group.deliveryDate.toLocaleDateString("fr-FR")}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="grid gap-4 md:grid-cols-1">
                        {group.items.map((item) => (
                          <ReservationItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-6">
                <SectionHeader icon={Percent} title="Financial Information" />
                <div className="space-y-4">
                  <ReadOnlyField
                    label="Amount TTC (DT)"
                    value={editedReservation.amountTTC}
                  />
                  <ReadOnlyField
                    label="Amount Ordered (DT)"
                    value={editedReservation.amountOrdered}
                  />
                  <ReadOnlyField
                    label="Shipping Amount (DT)"
                    value={editedReservation.shippingAmount}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-6">
                <SectionHeader icon={CheckCircle} title="Status Information" />
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      value={String(editedReservation.isActive)}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={`w-full rounded-lg px-4 py-2.5 shadow-sm transition focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.state
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                    {fieldErrors.state && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldErrors.state}
                      </p>
                    )}
                  </div>
                  <ReadOnlyField
                    label="From Mobile"
                    value={editedReservation.fromMobile ? "Yes" : "No"}
                  />
                  <ReadOnlyField
                    label="Shipping Method"
                    value={editedReservation.shippingMethod || ""}
                  />
                  <ReadOnlyField
                    label="Weight"
                    value={`${editedReservation.weight}`}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-6">
                <SectionHeader icon={Users} title="Additional Information" />
                <div className="space-y-4">
                  <ReadOnlyField
                    label="Customer"
                    value={`${editedReservation.customer?.firstName || ""} ${
                      editedReservation.customer?.lastName || ""
                    }`}
                  />
                  {fieldErrors.customer && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldErrors.customer}
                    </p>
                  )}
                  <ReadOnlyField
                    label="Created At"
                    value={new Date(
                      editedReservation.createdAt,
                    ).toLocaleDateString("fr-FR")}
                  />
                  <ReadOnlyField
                    label="Updated At"
                    value={new Date(
                      editedReservation.updatedAt,
                    ).toLocaleDateString("fr-FR")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <SectionHeader icon={MessageSquare} title="Comment" />
            <div className="mt-4">
              {reservation.comment ? (
                <div className="group relative">
                  {/* Comment container with max height and scroll */}
                  <div
                    className={`max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-200 ${
                      expandedComments[reservation.id] ? "max-h-[500px]" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      <p className="whitespace-pre-wrap break-words text-gray-700">
                        {reservation.comment}
                      </p>
                    </div>
                  </div>

                  {reservation.comment.length > 300 && (
                    <button
                      onClick={() => toggleCommentExpansion(reservation.id)}
                      className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      {expandedComments[reservation.id] ? (
                        <>
                          <ChevronUpIcon className="mr-1 h-4 w-4" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon className="mr-1 h-4 w-4" />
                          Show more
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-400">
                  <MessageSquare className="h-5 w-5 flex-shrink-0" />
                  <span>No comment provided</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-gray-100 bg-white px-8 py-6 shadow-sm">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                {isSaving && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;
