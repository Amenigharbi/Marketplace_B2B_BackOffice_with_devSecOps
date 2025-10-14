"use client";
import { useState, useEffect } from "react";

interface MyAccountProps {
  partnerData: any;
  onUpdate: (updatedData: any) => Promise<void>;
}

const MyAccount = ({ partnerData, onUpdate }: MyAccountProps) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    telephone: "",
  });

  useEffect(() => {
    if (partnerData) {
      setFormData({
        username: partnerData.username || "",
        email: partnerData.email || "",
        telephone: partnerData.telephone || "",
      });
    }
  }, [partnerData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      username: formData.username,
      telephone: formData.telephone,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="box p-6">
        <h3 className="mb-6 border-b border-dashed pb-4 text-lg font-medium">
          Account Information
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="mb-2 block font-medium">
              Username *
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg3"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleInputChange}
              id="username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full cursor-not-allowed rounded-lg border border-n30 bg-gray-100 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg4"
              value={formData.email}
              id="email"
              disabled
            />
          </div>

          <div>
            <label htmlFor="telephone" className="mb-2 block font-medium">
              Phone Number *
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg3"
              placeholder="Enter phone number"
              value={formData.telephone}
              onChange={handleInputChange}
              id="telephone"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn px-5">
              Save Changes
            </button>
            <button type="button" className="btn-outline px-5">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyAccount;
