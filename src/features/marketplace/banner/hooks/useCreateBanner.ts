import { useState } from "react";
import { axios } from "@/libs/axios";
import { toast } from "react-hot-toast";

export function useCreateBanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBanner = async (
    bannerData: {
      altText?: string;
      image: File | null;
      description?: string;
    },
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!bannerData.image) {
        throw new Error("Image is required");
      }

      const formData = new FormData();

      if (bannerData.altText) {
        formData.append("altText", bannerData.altText);
      }

      if (bannerData.description) {
        formData.append("description", bannerData.description);
      }
      formData.append("image", bannerData.image);

      const response = await axios.servicesClient.post(
        "/api/marketplace/banner/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 201) {
        toast.success("Banner created successfully");
        onSuccess?.();
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create banner";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error creating banner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { createBanner, isLoading, error };
}
