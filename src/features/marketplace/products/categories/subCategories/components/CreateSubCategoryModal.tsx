import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaTags } from "react-icons/fa";

interface CreateSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (subCategoryData: {
    name: string;
    isActive?: boolean;
    image?: File | null;
    categoryId: string;
  }) => void;
  categoryId: string | null;
}

const CreateSubCategoryModal = ({
  isOpen,
  onClose,
  onCreate,
  categoryId,
}: CreateSubCategoryModalProps) => {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim() || !categoryId) return;

    const subCategoryData = {
      name: name.trim(),
      isActive,
      image: imageFile,
      categoryId,
    };

    onCreate(subCategoryData);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setIsActive(true);
    setImageFile(null);
    setPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="mb-2 flex items-center gap-2">
          <FaTags className="h-7 w-7 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Subcategory
          </h2>
        </div>
        <div className="mb-4 border-b" />

        {/* Subcategory Name Input */}
        <div className="mb-4">
          <label
            htmlFor="subCategoryName"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Subcategory Name
          </label>
          <input
            id="subCategoryName"
            type="text"
            placeholder="Enter subcategory name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Active Status Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
            Active Subcategory
          </label>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label
            htmlFor="subCategoryImage"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Subcategory Image
          </label>
          <input
            id="subCategoryImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setPreviewUrl(null);
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white file:hover:bg-blue-600"
          />
          {previewUrl && (
            <div className="mt-3 flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-auto rounded-lg border object-cover shadow"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FaTags className="mr-2 inline-block h-4 w-4" />
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSubCategoryModal;
