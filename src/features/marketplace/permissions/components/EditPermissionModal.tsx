import { useState, useEffect } from "react";

interface EditPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, data: { resource: string }) => void;
  id: string;
  initialResource: string;
}
const EditPermissionModal: React.FC<EditPermissionModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  id,
  initialResource,
}) => {
  const [resource, setResource] = useState(initialResource);

  // Reset state when the initialResource or initialAction changes
  useEffect(() => {
    setResource(initialResource);
  }, [initialResource]);

  const handleSubmit = () => {
    if (!resource) {
      alert("resource must be provided.");
      return; // Prevent submitting if fields are empty
    }

    onEdit(id, { resource });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Edit Permission</h2>
        <input
          type="text"
          placeholder="Resource"
          className="mb-3 w-full rounded border p-2"
          value={resource}
          onChange={(e) => setResource(e.target.value)}
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

export default EditPermissionModal;
