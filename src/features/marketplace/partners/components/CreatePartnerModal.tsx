import { useState } from "react";
import toast from "react-hot-toast";

interface CreatePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (partner: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    address: string;
    password: string;
    mRoleId: string;
    logo?: File;
    patent?: File;
    responsibleName: string;
    position: string;
    coverageArea: string;
    minimumAmount: number;
    typePartnerId: string;
  }) => void;
  typePartners: Array<{ id: string; name: string }>;
  roles: Array<{ id: string; name: string }>;
}

const CreatePartnerModal = ({
  isOpen,
  onClose,
  onCreate,
  typePartners,
  roles,
}: CreatePartnerModalProps) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    address: "",
    password: "",
    mRoleId: "",
    logo: undefined as File | undefined, // Allow File or undefined
    patent: undefined as File | undefined, // Allow File or undefined
    responsibleName: "",
    position: "",
    coverageArea: "",
    minimumAmount: 0,
    typePartnerId: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.telephone.trim() ||
      !formData.address.trim() ||
      !formData.responsibleName.trim() ||
      !formData.position.trim() ||
      !formData.coverageArea.trim() ||
      formData.minimumAmount <= 0 ||
      !formData.typePartnerId.trim()
    ) {
      toast.error("Please fill in required fields");
      return;
    }
    onCreate(formData);
    setFormData({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      address: "",
      password: "",
      mRoleId: "",
      logo: undefined,
      patent: undefined,
      responsibleName: "",
      position: "",
      coverageArea: "",
      minimumAmount: 0,
      typePartnerId: "",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Partner
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Partnership Details - Left column */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">
              Partnership Details
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Responsible *
                </label>
                <input
                  type="text"
                  value={formData.responsibleName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responsibleName: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coverage Area *
                </label>
                <input
                  type="text"
                  value={formData.coverageArea}
                  onChange={(e) =>
                    setFormData({ ...formData, coverageArea: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Min Amount *
                </label>
                <input
                  type="number"
                  value={formData.minimumAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumAmount: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Partner Type *
              </label>
              <select
                value={formData.typePartnerId}
                onChange={(e) =>
                  setFormData({ ...formData, typePartnerId: e.target.value })
                }
                className="w-full rounded-lg border p-2 text-sm"
                required
              >
                <option value="">Select Partner Type</option>
                {typePartners?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                value={formData.mRoleId}
                onChange={(e) =>
                  setFormData({ ...formData, mRoleId: e.target.value })
                }
                className="w-full rounded-lg border p-2 text-sm"
                required
              >
                <option value="">Select Role</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal Information - Middle column */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full rounded-lg border p-2 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full rounded-lg border p-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border p-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-lg border p-2 text-sm"
                required
              />
            </div>
          </div>

          {/* Company Information - Right column */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">
              Company Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telephone
              </label>
              <input
                type="text"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                className="w-full rounded-lg border p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full rounded-lg border p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    logo: e.target.files ? e.target.files[0] : undefined,
                  })
                }
                className="w-full rounded-lg border p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patent
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    patent: e.target.files ? e.target.files[0] : undefined,
                  })
                }
                className="w-full rounded-lg border p-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-400 px-4 py-2 text-sm text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Create Partner
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePartnerModal;
