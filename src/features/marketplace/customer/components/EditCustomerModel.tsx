import { useState, useEffect } from "react";
import { Customer } from "@/types/customer";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, formData: FormData) => Promise<void>;
  customer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

const TUNISIA_GOVERNORATES = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Le Kef",
  "Mahdia",
  "La Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

const ACTIVITIES = [
  "alimentation générale",
  "fruits secs",
  "superette",
  "epics et salaisons",
  "vente volailles et dérivés",
  "patisserie",
  "boulangerie",
  "restaurant",
  "société",
  "vente legumes et fruits",
  "vente produits de parfumerie",
  "cce d'ecipes",
  "autre",
];

const BUSINESS_TYPES = [
  { value: "3attar", label: "عطار" },
  { value: "drugstore", label: "DrugStore-حماص" },
  { value: "superette", label: "Superette-سوبر ماركت" },
  { value: "mazraa", label: "El Mazraa-مزرعة" },
  { value: "epicier", label: "épicier-توابلي" },
  { value: "patisserie", label: "Patisserie-متجرالمعجنات" },
  { value: "boulangerie", label: "Boulangerie-مخبزة" },
  { value: "restaurant", label: "Restaurant-مطعم" },
  { value: "societe", label: "Societé-مؤسسة" },
  {
    value: "venteFruits",
    label: "Vente de fruits et légumes-بيع خضروات و غلال",
  },
  { value: "venteParfums", label: "Vente des parfums-بيع عطورات" },
];

const EditCustomerModal = ({
  isOpen,
  customer,
  onClose,
  onEdit,
  isLoading,
  error,
}: EditCustomerModalProps) => {
  const [form, setForm] = useState<Partial<Customer>>({});
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (customer) {
      setForm({
        ...customer,
        password: "",
        typePatente: customer.typePatente || undefined,
      });
    } else {
      setForm({});
    }
  }, [customer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setForm((prev) => ({
          ...prev!,
          [name]: files[0],
        }));
      }
    } else {
      setForm((prev) => ({ ...prev!, [name]: value }));
    }
  };

  const handleActivity1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedActivity = e.target.value;
    setForm((prev) => ({
      ...prev!,
      activity1: selectedActivity,
      activity2: prev?.activity2 === selectedActivity ? "" : prev?.activity2,
    }));
  };

  const handleActivity2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev!,
      activity2: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form || !customer) return;

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "telephone",
      "address",
      "governorate",
      "fiscalId",
      "businessType",
      "activity1",
    ];

    const missingFields = requiredFields.filter(
      (field) => !form[field as keyof typeof form],
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill all required fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    // Validate documents (either existing or new upload)
    if (
      (!form.cinPhoto && !customer.cinPhoto) ||
      (!form.patentPhoto && !customer.patentPhoto)
    ) {
      toast.error("Please upload all required documents (CIN and Patente)");
      return;
    }

    if (form.password && form.password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(form).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      await onEdit(customer.id, formData);
      toast.success("Customer updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating customer:", err);
      toast.error("Failed to update customer.");
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative my-8 w-full max-w-4xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Edit Customer</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          {error && (
            <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6 pt-0">
          <form id="customerForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={form?.firstName || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={form?.lastName || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form?.email || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone *
                  </label>
                  <input
                    name="telephone"
                    placeholder="Phone"
                    value={form?.telephone || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    New Password (optional)
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="New Password"
                    value={form?.password || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {form?.password && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Confirm Password *
                    </label>
                    <input
                      name="passwordConfirmation"
                      type="password"
                      placeholder="Confirm Password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                      required={!!form.password}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Address Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    name="address"
                    placeholder="Address"
                    value={form?.address || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Governorate *
                  </label>
                  <select
                    name="governorate"
                    value={form?.governorate || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a governorate</option>
                    {TUNISIA_GOVERNORATES.map((governorate) => (
                      <option key={governorate} value={governorate}>
                        {governorate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Business Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Social Name
                  </label>
                  <input
                    name="socialName"
                    placeholder="Social Name"
                    value={form?.socialName || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Fiscal ID *
                  </label>
                  <input
                    name="fiscalId"
                    placeholder="Fiscal ID"
                    value={form?.fiscalId || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={form?.businessType || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map((type, index) => (
                      <option key={index} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Primary Activity *
                  </label>
                  <select
                    name="activity1"
                    value={form?.activity1 || ""}
                    onChange={handleActivity1Change}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select primary activity</option>
                    {ACTIVITIES.map((activity, index) => (
                      <option key={index} value={activity}>
                        {activity}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Secondary Activity
                  </label>
                  <select
                    name="activity2"
                    value={form?.activity2 || ""}
                    onChange={handleActivity2Change}
                    disabled={!form?.activity1}
                    className={`w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500 ${
                      !form?.activity1 ? "cursor-not-allowed bg-gray-100" : ""
                    }`}
                  >
                    <option value="">Select secondary activity</option>
                    {ACTIVITIES.filter(
                      (activity) => activity !== form?.activity1,
                    ).map((activity, index) => (
                      <option key={index} value={activity}>
                        {activity}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Patent Type
                  </label>
                  <select
                    name="typePatente"
                    value={form?.typePatente || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a patent type</option>
                    <option value="FORFAITAIRE">Forfaitaire</option>
                    <option value="REELLE">Reelle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Required Documents *
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    CIN (National ID) *
                  </label>
                  {customer.cinPhoto ? (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Current file:{" "}
                      </span>
                      <a
                        href={customer.cinPhoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View CIN
                      </a>
                    </div>
                  ) : (
                    <p className="mb-3 text-sm text-red-500">
                      No CIN document uploaded
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                      <span>Upload New CIN</span>
                      <input
                        type="file"
                        name="cinPhoto"
                        onChange={handleChange}
                        className="hidden"
                        accept="image/*,.pdf"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {form.cinPhoto &&
                      typeof form.cinPhoto === "object" &&
                      "name" in form.cinPhoto
                        ? (form.cinPhoto as File).name
                        : "No new file selected"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Patente Fiscale *
                  </label>
                  {customer.patentPhoto ? (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Current file:{" "}
                      </span>
                      <a
                        href={customer.patentPhoto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View Patente
                      </a>
                    </div>
                  ) : (
                    <p className="mb-3 text-sm text-red-500">
                      No Patente document uploaded
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                      <span>Upload New Patente</span>
                      <input
                        type="file"
                        name="patentPhoto"
                        onChange={handleChange}
                        className="hidden"
                        accept="image/*,.pdf"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {form.patentPhoto &&
                      typeof form.patentPhoto === "object" &&
                      "name" in form.patentPhoto
                        ? (form.patentPhoto as File).name
                        : "No new file selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Sticky Bottom */}
        <div className="sticky bottom-0 rounded-b-2xl bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="customerForm"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-sm hover:bg-blue-700 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
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
                  Updating...
                </span>
              ) : (
                "Update Customer"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditCustomerModal;
