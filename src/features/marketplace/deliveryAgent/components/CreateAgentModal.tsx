import { useState } from "react";
import { Agent } from "@/types/agent";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FaUserPlus } from "react-icons/fa";

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agent: Omit<Agent, "id">) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const CreateAgentModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading,
  error,
}: CreateAgentModalProps) => {
  const [form, setForm] = useState<Partial<Agent>>({
    firstName: "",
    lastName: "",
    username: "",
    telephone: "",
    address: "",
    password: "",
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      username: "",
      telephone: "",
      address: "",
      password: "",
    });
    setPasswordConfirmation("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.firstName || !form.lastName || !form.password) {
      alert("Please fill all required fields");
      return;
    }

    if (form.password !== passwordConfirmation) {
      alert("Passwords don't match");
      return;
    }

    try {
      await onCreate(form as Omit<Agent, "id">);
      resetForm();
      onClose();
    } catch (err) {
      console.error("Error creating agent:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaUserPlus className="h-7 w-7 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Agent
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-4 border-b" />

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <svg
              className="h-5 w-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="e.g. foulen"
                value={form.firstName || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="e.g. ben foulen"
                value={form.lastName || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Removed Email Field */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Username *
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="e.g. Foulen"
                value={form.username || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="telephone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="telephone"
                type="tel"
                name="telephone"
                placeholder="e.g. +216 99 999 999"
                value={form.telephone || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="e.g. Manar 1 tunis"
              value={form.address || ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password *
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="passwordConfirmation"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirm Password *
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                name="passwordConfirmation"
                placeholder="Re-enter password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
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
                  </span>
                ) : (
                  <>
                    <FaUserPlus className="mr-2 inline-block h-4 w-4" />
                    Create Agent
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateAgentModal;
