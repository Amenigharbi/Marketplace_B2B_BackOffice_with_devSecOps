import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaImage } from "react-icons/fa";

interface CreateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (bannerData: {
    altText?: string;
    image: File | null;
    description?: string;
  }) => void;
}

const CreateBannerModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateBannerModalProps) => {
  const [altText, setAltText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!imageFile) {
      setImageError("Please select an image file");
      return;
    }
    const bannerData = {
      altText: altText.trim() || undefined,
      image: imageFile,
      description: description.trim() || undefined,
    };
    onCreate(bannerData);
    resetForm();
  };

  const resetForm = () => {
    setAltText("");
    setDescription("");
    setImageFile(null);
    setImageError("");
    setPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fade-in relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="mb-2 flex items-center gap-2">
          <FaImage className="h-7 w-7 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Banner
          </h2>
        </div>
        <div className="mb-4 border-b" />

        <div className="mb-5">
          <label
            htmlFor="bannerImage"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Banner Image <span className="text-red-500">*</span>
          </label>
          <input
            id="bannerImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              setImageError("");
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setPreviewUrl(null);
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white file:hover:bg-blue-600"
          />
          {imageError && (
            <p className="mt-1 text-sm text-red-500">{imageError}</p>
          )}
          {previewUrl && (
            <div className="mt-3 flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-auto rounded-lg border object-cover shadow"
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="altText"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Alt Text
          </label>
          <input
            id="altText"
            type="text"
            placeholder="Enter alt text for accessibility"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter banner description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <FaImage className="mr-2 inline-block h-4 w-4" />
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBannerModal;
