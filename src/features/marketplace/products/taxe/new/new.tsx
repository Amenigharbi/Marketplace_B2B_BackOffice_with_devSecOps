"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

const NewTaxPage = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/marketplace/tax/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: parseFloat(value) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create tax");
      }

      setSuccess("Tax created successfully!");
      setValue("");

      setTimeout(() => {
        router.push("/marketplace/products/taxe/all");
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">New Tax</h1>
          <p className="mt-2 text-gray-500">Enter the tax percentage value</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start rounded-lg bg-red-50 p-4">
            <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start rounded-lg bg-green-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-700">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="tax-input"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Tax Percentage
            </label>
            <div className="relative">
              <input
                id="tax-input"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00 %"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/marketplace/products/taxe/all")}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
                "Save Tax"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaxPage;
