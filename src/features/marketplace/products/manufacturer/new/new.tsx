"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiMail,
  FiPhone,
  FiUser,
  FiGlobe,
  FiDollarSign,
  FiTruck,
  FiTag,
  FiCode,
  FiBriefcase,
  FiMapPin,
  FiX,
  FiCheck,
} from "react-icons/fi";

type Category = {
  id: string;
  nameCategory: string;
};

const NewManufacturerPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    manufacturerId: "",
    code: "",
    companyName: "",
    contactName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    country: "",
    capital: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/marketplace/category/getAll");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch categories");
        }

        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setSelectedCategories(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const parsedManufacturerId = parseInt(formData.manufacturerId, 10);

    if (isNaN(parsedManufacturerId)) {
      setError("Manufacturer ID must be a valid number.");
      setLoading(false);
      return;
    }
    if (!formData.code || !formData.companyName) {
      setError("Code and Company Name are required.");
      setLoading(false);
      return;
    }

    try {
      const { manufacturerId, ...formDataWithoutId } = formData;
      const response = await fetch("/api/marketplace/supplier/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manufacturerId: parsedManufacturerId,
          ...formDataWithoutId,
          categories: selectedCategories,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create manufacturer");
      }

      setSuccess("Manufacturer created successfully!");
      setFormData({
        manufacturerId: "",
        code: "",
        companyName: "",
        contactName: "",
        phoneNumber: "",
        email: "",
        address: "",
        city: "",
        country: "",
        capital: "",
      });
      setSelectedCategories([]);

      setTimeout(() => {
        router.push("/marketplace/products/manufacturer/all");
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: "manufacturerId",
      label: "Manufacturer ID",
      type: "number",
      required: true,
      icon: <FiTruck className="text-gray-500" />,
    },
    {
      name: "code",
      label: "Code",
      type: "text",
      required: true,
      icon: <FiCode className="text-gray-500" />,
    },
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      required: true,
      icon: <FiBriefcase className="text-gray-500" />,
    },
    {
      name: "contactName",
      label: "Contact Name",
      type: "text",
      required: true,
      icon: <FiUser className="text-gray-500" />,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      required: true,
      icon: <FiPhone className="text-gray-500" />,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      icon: <FiMail className="text-gray-500" />,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: true,
      icon: <FiMapPin className="text-gray-500" />,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      required: true,
      icon: <FiHome className="text-gray-500" />,
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      required: true,
      icon: <FiGlobe className="text-gray-500" />,
    },
    {
      name: "capital",
      label: "Capital",
      type: "text",
      required: true,
      icon: <FiDollarSign className="text-gray-500" />,
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
      <div className="mt-36 w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          New Manufacturer
        </h1>

        {error && (
          <div className="mb-6 flex items-center rounded-lg bg-red-100 px-4 py-3 text-red-600">
            <FiX className="mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center rounded-lg bg-green-100 px-4 py-3 text-green-600">
            <FiCheck className="mr-2" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.name} className="relative">
                <label
                  htmlFor={field.name}
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-3">
                    {field.icon}
                  </div>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    required={field.required}
                    className="mt-1 w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder={field.label}
                  />
                </div>
              </div>
            ))}

            <div className="relative col-span-2">
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Categories
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-3">
                  <FiTag className="text-gray-500" />
                </div>
                <select
                  id="category"
                  multiple
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">Select Categories</option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nameCategory}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Hold Ctrl/Cmd to select multiple categories
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() =>
                router.push("/marketplace/products/manufacturer/all")
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-3 font-medium text-gray-700 transition duration-300 hover:bg-gray-300 hover:text-gray-900"
            >
              <FiX /> Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition duration-300 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck /> Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewManufacturerPage;
