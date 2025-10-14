import { useState } from "react";

interface CreateProductStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, actif: boolean) => void;
}

const CreateProductStatusModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductStatusModalProps) => {
  const [name, setName] = useState("");
  const [actif, setActif] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Add Product Status</h2>

        <input
          type="text"
          className="mb-4 w-full rounded border p-2"
          placeholder="Status Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mb-4 flex items-center">
          <label className="mr-2">Active:</label>
          <input
            type="checkbox"
            checked={actif}
            onChange={() => setActif(!actif)}
            className="rounded"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button className="rounded bg-gray-300 px-4 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => {
              if (!name.trim()) return;
              onCreate(name.trim(), actif);
              setName("");
              setActif(true);
              onClose();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductStatusModal;
