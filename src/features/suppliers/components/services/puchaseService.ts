import { PurchaseOrderUpdate } from "../types/purchaseOrder";

export const updatePurchaseOrder = async (
  orderId: string,
  updatedData: PurchaseOrderUpdate,
) => {
  const response = await fetch(`/api/purchases/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`error update ${errorText}`);
  }

  return response.json();
};
