import { useState, useEffect } from "react";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, data: { name: string }) => void;
  id: string;
  initialName: string;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  id,
  initialName,
}) => {
  const [name, setName] = useState(initialName);

  // Reset when initialName changes
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = () => {
    if (!name) {
      alert("Role name must be provided.");
      return;
    }

    onEdit(id, { name });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Edit Role</h2>
        <input
          type="text"
          placeholder="Role name"
          className="mb-3 w-full rounded border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

export default EditRoleModal;
