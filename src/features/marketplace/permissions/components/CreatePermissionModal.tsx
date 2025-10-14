import { useState } from "react";

interface CreatePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { resource: string }) => void;
}

const CreatePermissionModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreatePermissionModalProps) => {
  const [resource, setResource] = useState("");

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
        <h2 className="text-xl font-bold">Add Permission</h2>

        <input
          type="text"
          placeholder="Resource (e.g., 'product')"
          value={resource}
          onChange={(e) => setResource(e.target.value)}
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
              onCreate({ resource });
              setResource("");
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

export default CreatePermissionModal;
