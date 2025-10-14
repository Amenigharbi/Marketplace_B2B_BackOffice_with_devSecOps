import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export interface Setting {
  id: string;
  deliveryType: string;
  deliveryTypeAmount: string;
  freeDeliveryAmount: string;
  loyaltyPointsAmount: string;
  loyaltyPointsUnique: string;
  partnerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useSettingsActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editSetting = async (id: string, updatedSetting: Partial<Setting>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.patch(
        `/api/marketplace/settings/${id}`,
        updatedSetting,
      );
      if (response.status === 200) {
        toast.success("Setting updated successfully!");
        return response.data.setting;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update setting";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error updating setting:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSetting = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/marketplace/settings/${id}`);
      if (response.status === 200) {
        toast.success("Setting deleted successfully!");
        return response.data.message;
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete setting";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting setting:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { editSetting, deleteSetting, isLoading, error };
}
