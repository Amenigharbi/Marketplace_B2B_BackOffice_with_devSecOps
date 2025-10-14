import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Banner } from "@/types/banner";

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (bannerData: {
    id: string;
    altText?: string;
    description?: string;
    image?: File | null;
  }) => void;
  initialData: Banner | null;
}

const EditBannerModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
}: EditBannerModalProps) => {
  const [altText, setAltText] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setAltText(initialData.altText || "");
      setCurrentImageUrl(initialData.url);
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!initialData) return;

    const bannerData = {
      id: initialData.id,
      altText: altText.trim() || undefined,
      description: description.trim() || undefined,
      image: imageFile,
    };

    onEdit(bannerData);
    resetForm();
  };

  const resetForm = () => {
    setAltText("");
    setImageFile(null);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-800">Edit Banner</h2>

        <div className="mb-4">
          <label
            htmlFor="altText"
            className="block text-sm font-medium text-gray-700"
          >
            Alt Text
          </label>
          <input
            id="altText"
            type="text"
            placeholder="Enter alt text for accessibility"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter banner description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="bannerImage"
            className="block text-sm font-medium text-gray-700"
          >
            Banner Image
          </label>
          {currentImageUrl && (
            <div className="mb-2">
              <div className="mt-2 flex items-center justify-center">
                <img
                  src={currentImageUrl}
                  alt={altText || "Current banner"}
                  className="max-h-32 rounded border object-contain"
                />
              </div>
            </div>
          )}
          <input
            id="bannerImage"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white file:hover:bg-blue-600"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBannerModal;
