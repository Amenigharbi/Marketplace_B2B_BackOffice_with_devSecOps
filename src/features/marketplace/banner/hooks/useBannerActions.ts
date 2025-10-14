import { useState } from "react";
import { axios } from "@/libs/axios";
import { Banner } from "@/types/banner";
import { toast } from "react-hot-toast";

export function useBannerActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editBanner = async (
    id: string,
    updatedBanner: Partial<Banner> & { image?: File | null },
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      if (updatedBanner.altText !== undefined) {
        formData.append("altText", updatedBanner.altText || "");
      }

      // Ajouter la description si elle est définie
      if (updatedBanner.description !== undefined) {
        formData.append("description", updatedBanner.description || "");
      }

      if (updatedBanner.image) {
        formData.append("image", updatedBanner.image);
      }

      const response = await axios.servicesClient.patch(
        `/api/marketplace/banner/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        toast.success("Banner updated successfully");
        return response.data.banner;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update banner";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating banner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBanner = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.servicesClient.delete(
        `/api/marketplace/banner/${id}`,
      );
      if (response.status === 200) {
        toast.success("Banner deleted successfully");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete banner";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting banner:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editBanner, deleteBanner, isLoading, error };
}
