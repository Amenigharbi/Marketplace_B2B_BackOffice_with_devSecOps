import { useState, useEffect } from "react";
import { SubCategory } from "@/types/subCategory";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface EditSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (subCategoryData: {
    id: string;
    name: string;
    isActive?: boolean;
    image?: File | null;
    categoryId: string;
  }) => void;
  initialData: SubCategory | null;
  categoryId: string | null;
}

const EditSubCategoryModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
  categoryId,
}: EditSubCategoryModalProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIsActive(initialData.isActive ?? true);
      if (initialData.image) {
        // Si vous avez une URL d'image existante
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(initialData?.image || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || !initialData) return;

    const subCategoryData = {
      id: initialData.id,
      name: name.trim(),
      isActive,
      image: imageFile,
      categoryId,
    };

    onEdit(subCategoryData);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setIsActive(true);
    setImageFile(null);
    setImagePreview(null);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Subcategory
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update the details of your subcategory
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Subcategory Name Input */}
            <div>
              <label
                htmlFor="subCategoryName"
                className="block text-sm font-medium text-gray-700"
              >
                Subcategory Name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="subCategoryName"
                  type="text"
                  placeholder="e.g. Smartphones, Laptops..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Active Status Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="isActive"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <p className="text-sm text-gray-500">
                  {isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isActive ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="subCategoryImage"
                className="block text-sm font-medium text-gray-700"
              >
                Subcategory Image
              </label>
              <div className="mt-1 flex items-center gap-4">
                {imagePreview && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <img
                      src={imagePreview}
                      alt="Current subcategory"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-center transition-colors hover:border-blue-500">
                    <p className="text-sm text-gray-600">
                      {imageFile
                        ? imageFile.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <input
                      id="subCategoryImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
              {initialData.image && !imageFile && (
                <p className="mt-2 text-xs text-gray-500">
                  Current: {initialData.image.split("/").pop()}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={!name.trim()}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubCategoryModal;
