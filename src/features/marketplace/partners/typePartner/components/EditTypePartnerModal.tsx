import { useState, useEffect } from "react";

interface EditTypePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, name: string) => void;
  id: string;
  initialName: string;
}

const EditTypePartnerModal: React.FC<EditTypePartnerModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  id,
  initialName,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = () => {
    onEdit(id, name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Edit Type Partner</h2>
        <input
          type="text"
          className="mb-4 w-full rounded border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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

export default EditTypePartnerModal;
