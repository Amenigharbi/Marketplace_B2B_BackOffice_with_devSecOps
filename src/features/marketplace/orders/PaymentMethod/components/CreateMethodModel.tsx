import { useState } from "react";

interface CreateMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateMethodModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateMethodModalProps) => {
  const [name, setName] = useState("");

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
        <h2 className="text-xl font-bold">Add Payment Method</h2>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
              onCreate(name);
              setName("");
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

export default CreateMethodModal;
