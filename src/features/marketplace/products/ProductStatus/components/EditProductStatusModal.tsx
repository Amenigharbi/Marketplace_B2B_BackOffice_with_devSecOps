import { useState, useEffect } from "react";

interface EditProductStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, newName: string, actif: boolean) => void;
  id: string;
  initialName: string;
  initialActif: boolean;
}

const EditProductStatusModal: React.FC<EditProductStatusModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  id,
  initialName,
  initialActif,
}) => {
  const [name, setName] = useState(initialName);
  const [actif, setActif] = useState(initialActif);

  useEffect(() => {
    setName(initialName);
    setActif(initialActif);
  }, [initialName, initialActif]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onEdit(id, name.trim(), actif);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Edit Product Status</h2>

        {/* Name input field */}
        <input
          type="text"
          className="mb-4 w-full rounded border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Actif toggle (checkbox) */}
        <div className="mb-4 flex items-center">
          <label className="mr-2">Active:</label>
          <input
            type="checkbox"
            checked={actif}
            onChange={() => setActif(!actif)} // Toggle 'actif' state
            className="rounded"
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button className="rounded bg-gray-300 px-4 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductStatusModal;
