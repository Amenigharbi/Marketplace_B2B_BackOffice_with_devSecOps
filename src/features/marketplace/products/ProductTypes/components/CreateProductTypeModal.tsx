import { useState } from "react";

interface CreateProductTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: string) => void;
}

const CreateProductTypeModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductTypeModalProps) => {
  const [type, setType] = useState("");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-96 rounded-lg bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">Add Product Type</h2>
        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-2 w-full rounded-lg border p-2"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onCreate(type);
              setType("");
            }}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductTypeModal;
