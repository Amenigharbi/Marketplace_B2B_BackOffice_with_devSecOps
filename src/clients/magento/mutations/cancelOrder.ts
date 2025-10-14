import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

export const cancelOrder = async (orderId: string): Promise<any> => {
  try {
    // Changed to POST with correct endpoint format
    const res = await axios.magentoClient.post(`orders/${orderId}/cancel`);

    return res?.data;
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
