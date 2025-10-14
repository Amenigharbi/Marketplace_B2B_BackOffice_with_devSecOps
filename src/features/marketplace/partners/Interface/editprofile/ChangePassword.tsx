"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import InputPassword from "./InputPassword";
import { hash } from "bcryptjs";

interface ChangePasswordProps {
  partnerId: string;
}

const ChangePassword = ({ partnerId }: ChangePasswordProps) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      // First verify the current password
      await axios.post(`/api/marketplace/partners/verify-password`, {
        partnerId,
        password: formData.oldPassword,
      });

      // If verification passed, update the password
      const data = new FormData();
      data.append("password", formData.newPassword);

      const response = await axios.patch(
        `/api/marketplace/partners/${partnerId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        toast.success("Password changed successfully");
        // Reset form
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error("Failed to update password");
      }
    } catch (error: any) {
      // Check if the error is from password verification
      if (error.response?.status === 401) {
        toast.error("Current password is incorrect");
      } else {
        const errorMessage =
          error.response?.data?.error || "Failed to change password";
        toast.error(errorMessage);
      }
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="box mb-6 p-6">
      <p className="mb-6 border-b border-dashed pb-4 font-medium">
        Change Password
      </p>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <div className="col-span-2 md:col-span-1">
          <label className="mb-4 block font-medium">Current Password</label>
          <InputPassword
            placeholder="Current Password"
            value={formData.oldPassword}
            onChange={(value) => handleChange("oldPassword", value)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="mb-4 block font-medium">New Password</label>
          <InputPassword
            placeholder="New Password"
            value={formData.newPassword}
            onChange={(value) => handleChange("newPassword", value)}
          />
        </div>
        <div className="col-span-2">
          <label className="mb-4 block font-medium">Confirm Password</label>
          <InputPassword
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
          />
        </div>
        <div className="col-span-2 flex gap-4">
          <button type="submit" className="btn px-5" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="btn-outline px-5"
            onClick={() => {
              setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
