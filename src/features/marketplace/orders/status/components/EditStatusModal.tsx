import { useState, useEffect } from "react";
import { useGetAllStates } from "../../state/hooks/useGetAllStates";
import { useStatusActions } from "../hooks/useStatusActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Status {
  id: string;
  name: string;
  stateId: string;
}

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: Status | null;
  onSave: (updatedStatus: Status) => void;
}

const EditStatusModal = ({
  isOpen,
  onClose,
  status,
  onSave,
}: EditStatusModalProps) => {
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");
  const { editStatus, isLoading } = useStatusActions();
  const { state: states } = useGetAllStates();
  const [errors, setErrors] = useState({
    name: "",
    stateId: "",
  });

  useEffect(() => {
    if (isOpen && status) {
      setName(status.name);
      setStateId(status.stateId);
      setErrors({ name: "", stateId: "" });
    }
  }, [isOpen, status]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      stateId: "",
    };

    if (!name.trim()) {
      newErrors.name = "Status name is required";
      valid = false;
    }

    if (!stateId) {
      newErrors.stateId = "Please select a state";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validateForm() || isLoading) return;

    const toastId = toast.loading("Updating status...", {
      position: "top-center",
      autoClose: false,
    });

    try {
      const updatedStatus = { id: status!.id, name: name.trim(), stateId };
      await editStatus(status!.id, updatedStatus);

      toast.update(toastId, {
        render: "Status updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      onSave(updatedStatus);
      onClose();
    } catch (error: any) {
      let errorMessage = "Failed to update status";

      if (error.code === "P2002") {
        errorMessage = "A status with this name already exists";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  if (!isOpen || !status) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
          aria-label="Close"
          disabled={isLoading}
        >
          <span aria-hidden>×</span>
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-800">Edit Status</h2>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status Name
          </label>
          <input
            type="text"
            placeholder="Enter status name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            className={`w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            State
          </label>
          <select
            value={stateId}
            onChange={(e) => {
              setStateId(e.target.value);
              if (errors.stateId)
                setErrors((prev) => ({ ...prev, stateId: "" }));
            }}
            className={`w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
              errors.stateId
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          >
            <option value="">Select state</option>
            {states?.map((state: { id: string; name: string }) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.stateId && (
            <p className="mt-1 text-sm text-red-500">{errors.stateId}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-70"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="-ml-1 mr-2 inline h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStatusModal;
