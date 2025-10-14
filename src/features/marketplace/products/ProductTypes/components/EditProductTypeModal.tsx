import { useState, useEffect } from "react";

interface EditProductTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, newType: string) => void;
  id: string;
  initialType: string;
}

const EditProductTypeModal: React.FC<EditProductTypeModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  id,
  initialType,
}) => {
  const [type, setType] = useState(initialType);

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  const handleSubmit = () => {
    onEdit(id, type);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Edit Product Type</h2>
        <input
          type="text"
          className="mb-4 w-full rounded border p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
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

export default EditProductTypeModal;
