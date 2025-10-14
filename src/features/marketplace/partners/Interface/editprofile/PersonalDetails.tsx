"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface PersonalDetailsProps {
  partnerData: any;
  onUpdate: (updatedData: any) => Promise<void>;
}

const PersonalDetails = ({ partnerData, onUpdate }: PersonalDetailsProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    position: "",
    coverageArea: "",
    minimumAmount: 0,
    logo: undefined as File | undefined,
    patent: undefined as File | undefined,
  });

  useEffect(() => {
    if (partnerData) {
      setFormData({
        firstName: partnerData.firstName || "",
        lastName: partnerData.lastName || "",
        address: partnerData.address || "",
        position: partnerData.position || "",
        coverageArea: partnerData.coverageArea || "",
        minimumAmount: partnerData.minimumAmount || 0,
        logo: undefined,
        patent: undefined,
      });
    }
  }, [partnerData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [id]: e.target.files?.[0],
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [id]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Column */}
      <div className="box p-6">
        <h3 className="mb-6 border-b border-dashed pb-4 text-lg font-medium">
          Personal Information
        </h3>

        {/* Profile Photo */}
        <div className="mb-6">
          <p className="mb-4 font-medium">Profile Photo</p>
          <div className="flex items-center gap-4">
            <Image
              src={partnerData.logo || "/images/profile-photo.png"}
              width={80}
              height={80}
              className="rounded-full"
              alt="Profile"
            />
            <div>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
              <label htmlFor="logo" className="btn inline-block cursor-pointer">
                Upload Photo
              </label>
              {formData.logo && (
                <p className="mt-2 text-sm text-green-500">
                  New photo selected
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Patent Document */}
        <div className="mb-6">
          <p className="mb-4 font-medium">Patent Document</p>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="file"
              id="patent"
              accept="application/pdf"
              onChange={handleInputChange}
              className="hidden"
            />
            <label htmlFor="patent" className="btn inline-block cursor-pointer">
              Upload Patent
            </label>
            {partnerData.patent && (
              <a
                href={partnerData.patent}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                View Current
              </a>
            )}
            {formData.patent && (
              <p className="mt-2 text-sm text-green-500">New patent selected</p>
            )}
          </div>
        </div>

        {/* Name Fields */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-2 block font-medium">
                First Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg3"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-2 block font-medium">
                Last Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg3"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                id="lastName"
                required
              />
            </div>
          </div>

          {/* Position */}
          <div className="mb-6">
            <label htmlFor="position" className="mb-2 block font-medium">
              Position
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg3"
              placeholder="Enter Position"
              value={formData.position}
              onChange={handleInputChange}
              id="position"
              required
            />
          </div>

          <div className="mt-6 flex gap-4">
            <button type="submit" className="btn px-5">
              Save Changes
            </button>
            <button type="button" className="btn-outline px-5">
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Right Column */}
      <div className="box p-6">
        <h3 className="mb-6 border-b border-dashed pb-4 text-lg font-medium">
          Business Information
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Address */}
          <div className="mb-6">
            <label htmlFor="address" className="mb-2 block font-medium">
              Address
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg3"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleInputChange}
              id="address"
              required
            />
          </div>

          {/* Coverage Area */}
          <div className="mb-6">
            <label htmlFor="coverageArea" className="mb-2 block font-medium">
              Coverage Area
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg3"
              placeholder="Enter Coverage Area"
              value={formData.coverageArea}
              onChange={handleInputChange}
              id="coverageArea"
              required
            />
          </div>

          {/* Minimum Amount */}
          <div className="mb-6">
            <label htmlFor="minimumAmount" className="mb-2 block font-medium">
              Minimum Amount
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 focus:outline-none dark:border-n500 dark:bg-bg3"
              placeholder="Enter Minimum Amount"
              value={formData.minimumAmount}
              onChange={handleInputChange}
              id="minimumAmount"
              required
            />
          </div>

          <div className="mt-6 flex gap-4">
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

export default PersonalDetails;
