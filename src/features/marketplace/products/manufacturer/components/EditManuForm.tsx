"use client";
import { useState, useEffect } from "react";
import { Manufacturer, Category } from "../types/manufacturer";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Product {
  id: string;
  name: string;
  sku: string;
  supplierId?: string;
}

const EditManuForm = ({
  manufacturer,
  onClose,
  onUpdate,
}: {
  manufacturer: Manufacturer;
  onClose: () => void;
  onUpdate: (updatedManufacturer: Manufacturer) => void;
}) => {
  const [formData, setFormData] = useState({
    companyName: manufacturer.companyName,
    contactName: manufacturer.contactName || "",
    phoneNumber: manufacturer.phoneNumber || "",
    email: manufacturer.email || "",
    address: manufacturer.address || "",
    city: manufacturer.city || "",
    country: manufacturer.country || "",
    postalCode: manufacturer.postalCode || "",
    capital: manufacturer.capital || "",
  });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products (only available or assigned to this manufacturer)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch("/api/marketplace/products/getAll");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        // Filtrer les produits :
        // - soit non assignés (supplierId null/undefined)
        // - soit déjà assignés à ce fournisseur
        const filteredProducts = data.data.filter(
          (product: Product) =>
            !product.supplierId || product.supplierId === manufacturer.id,
        );

        setAvailableProducts(filteredProducts);

        // Set currently assigned products
        const assignedProducts = filteredProducts.filter(
          (product: Product) => product.supplierId === manufacturer.id,
        );
        setSelectedProductIds(assignedProducts.map((p: Product) => p.id));
      } catch (error) {
        console.error("Error loading products:", error);
        setAvailableProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [manufacturer.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedProductIds(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      setError("Company Name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedManufacturer = {
        ...manufacturer,
        ...formData,
        selectedProductIds,
      };

      await onUpdate(updatedManufacturer); // Cette fonction va maintenant rafraîchir les données
      onClose(); // Fermer le modal après la mise à jour
    } catch (err) {
      setError("Failed to update manufacturer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm transition-opacity">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Manufacturer
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update the manufacturer details
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <div className="space-y-6 rounded-lg bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <span className="mr-2 text-blue-600">•</span>
                Company Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Capital
                  </label>
                  <input
                    name="capital"
                    type="text"
                    value={formData.capital}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 rounded-lg bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <span className="mr-2 text-blue-600">•</span>
                Contact Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Contact Name
                  </label>
                  <input
                    name="contactName"
                    type="text"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-6 rounded-lg bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <span className="mr-2 text-blue-600">•</span>
                Address Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-6 rounded-lg bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <span className="mr-2 text-blue-600">•</span>
                Assigned Products
              </h3>
              {loadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select Products
                  </label>
                  {availableProducts.length > 0 ? (
                    <>
                      <select
                        multiple
                        value={selectedProductIds}
                        onChange={handleProductChange}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        size={Math.min(6, availableProducts.length)}
                      >
                        {availableProducts.map((product) => (
                          <option
                            key={product.id}
                            value={product.id}
                            className={`py-2 hover:bg-blue-50 ${
                              product.supplierId === manufacturer.id
                                ? "font-medium text-blue-600"
                                : ""
                            }`}
                          >
                            <div className="flex items-center">
                              {product.supplierId === manufacturer.id && (
                                <span className="mr-2 text-blue-500">✓</span>
                              )}
                              <span>
                                {product.name} ({product.sku})
                              </span>
                            </div>
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-gray-500">
                        Hold Ctrl (or Cmd on Mac) to select multiple products.
                        Only available products are shown.
                      </p>
                    </>
                  ) : (
                    <p className="mt-4 text-center text-sm text-gray-500">
                      No available products in the database
                    </p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
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
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditManuForm;
