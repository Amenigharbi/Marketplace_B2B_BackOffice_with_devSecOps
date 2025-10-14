import { useState, useEffect } from "react";
import { Agent } from "@/types/agent";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaUserEdit } from "react-icons/fa";

interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, updatedAgent: Agent) => Promise<void>;
  agent: Agent | null;
  isLoading: boolean;
  error: string | null;
}

const EditAgentModal = ({
  isOpen,
  agent,
  onClose,
  onEdit,
  isLoading,
  error,
}: EditAgentModalProps) => {
  const [form, setForm] = useState<Partial<Agent> | null>(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (agent) {
      setForm({ ...agent, password: "" });
      setPasswordConfirmation("");
    }
  }, [agent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form?.firstName || !form.lastName) {
      alert("Please fill all required fields");
      return;
    }

    if (form.password && form.password !== passwordConfirmation) {
      alert("Passwords don't match");
      return;
    }

    try {
      const dataToSend = form.password
        ? form
        : { ...form, password: undefined };
      if (form.id) {
        await onEdit(form.id, dataToSend as Agent);
        onClose();
      }
    } catch (err) {
      console.error("Error updating agent:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUserEdit className="h-7 w-7 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Edit Agent</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X size={24} />
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
                    name="firstName"
                    placeholder="e.g. Foulen"
                    value={form?.firstName || ""}
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
                    name="lastName"
                    placeholder="e.g. ben foulen"
                    value={form?.lastName || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Username *
                  </label>
                  <input
                    name="username"
                    placeholder="e.g.foulen"
                    value={form?.username || ""}
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
                    name="telephone"
                    placeholder="e.g. +216 99 999 999"
                    value={form?.telephone || ""}
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
                  name="address"
                  placeholder="e.g. 123 Main St, City"
                  value={form?.address || ""}
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
                    New Password (optional)
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    value={form?.password || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {form?.password && (
                  <div>
                    <label
                      htmlFor="passwordConfirmation"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      name="passwordConfirmation"
                      type="password"
                      placeholder="Re-enter password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-3">
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
                  className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaUserEdit className="mr-2 inline-block h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAgentModal;
