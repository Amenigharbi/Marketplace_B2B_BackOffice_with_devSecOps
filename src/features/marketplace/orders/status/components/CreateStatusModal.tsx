import { useState, useEffect } from "react";
import { useGetAllStates } from "../../state/hooks/useGetAllStates";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CreateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, stateId: string) => Promise<void>;
}

const CreateStatusModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateStatusModalProps) => {
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    stateId: "",
  });

  const { state: states, isLoading, error } = useGetAllStates();

  useEffect(() => {
    if (isOpen) {
      setName("");
      setStateId("");
      setIsSubmitting(false);
      setErrors({
        name: "",
        stateId: "",
      });
    }
  }, [isOpen]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      stateId: "",
    };

    if (!name.trim()) {
      newErrors.name = "Status name is required";
      valid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Status name must be at least 2 characters";
      valid = false;
    }

    if (!stateId) {
      newErrors.stateId = "Please select a state";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onCreate(name.trim(), stateId);

      onClose();
    } catch (error: any) {
      let errorMessage = "Failed to create status";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Create New Status</h2>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status Name
            </label>
            <input
              type="text"
              placeholder="Enter status name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              className={`w-full rounded-lg border px-3 py-2 transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-transparent focus:ring-blue-500"
              }`}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              State
            </label>
            {isLoading ? (
              <div className="flex animate-pulse space-x-4">
                <div className="flex-1 rounded bg-gray-200 py-2"></div>
              </div>
            ) : error ? (
              <p className="text-sm text-red-500">Failed to load states</p>
            ) : (
              <>
                <select
                  value={stateId}
                  onChange={(e) => {
                    setStateId(e.target.value);
                    if (errors.stateId) {
                      setErrors((prev) => ({ ...prev, stateId: "" }));
                    }
                  }}
                  className={`w-full appearance-none rounded-lg border px-3 py-2 transition-all focus:outline-none focus:ring-2 ${
                    errors.stateId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-transparent focus:ring-blue-500"
                  }`}
                >
                  <option value="">Select a state</option>
                  {states?.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.stateId && (
                  <p className="mt-1 text-sm text-red-500">{errors.stateId}</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
              isSubmitting
                ? "cursor-wait bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="-ml-1 mr-2 inline h-4 w-4 animate-spin text-white"
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
                Creating...
              </>
            ) : (
              "Create Status"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStatusModal;
