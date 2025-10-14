import { Order } from "@/types/order";
import { getOrderItems } from "../getOrderItems";
import { getOrderSource } from "../getOrderSource";
import { getOrderProductsNames } from "../../getOrderProductsNames";

function getCurrentUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}


function getUnixTimestampTomorrow() {
  // Get the current date
  const today = new Date();

  // Create a new date object for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Convert the date object to a UNIX timestamp (in seconds)
  return Math.floor(tomorrow.getTime() / 1000);
}
const deliveryDateToUnixTimeStamp = (deliveryDate: string): number | undefined => {
  if (!deliveryDate) {
    return getUnixTimestampTomorrow();
  }

  const date = new Date(deliveryDate);
  return Math.floor(date.getTime() / 1000);
};

const safeString = (value: any): string => (value ? String(value) : "");

export const getOrdersBatch = (orders: any): Order[] =>
  orders?.map((order: any) => {
    const items = getOrderItems(order?.items);
    const productsNames = getOrderProductsNames(items);
    return {
      id: safeString(order?.entity_id),
      orderId: safeString(order?.entity_id),
      incrementId: safeString(order?.increment_id),
      kamiounId: safeString(order?.extension_attributes?.kamioun_order_id),
      storeId: safeString(order?.store_id),
      state: safeString(order?.state),
      status: safeString(order?.status),
      total: Number(order?.subtotal) || 0,
      createdAt:
        new Date(order?.created_at).getTime() || getCurrentUnixTimestamp(),
      updatedAt:
        new Date(order?.created_at).getTime() || getCurrentUnixTimestamp(),
      customerId: safeString(order?.customer_id),
      customerFirstname: safeString(order?.customer_firstname),
      customerLastname: safeString(order?.customer_lastname),
      customerPhone: safeString(order?.billing_address?.telephone),
      deliveryAgentId: safeString(
        order?.extension_attributes?.delivery_agent_id,
      ),
      deliveryAgentName: safeString(
        order?.extension_attributes?.delivery_agent,
      ),
      deliveryStatus: safeString(order?.extension_attributes?.delivery_status),
      deliveryDate: deliveryDateToUnixTimeStamp(
        order?.extension_attributes?.delivery_date,
      ),
      source: getOrderSource(
        !!order?.extension_attributes?.from_mobile,
        !!order?.extension_attributes?.verified,
      ),
      productsNames,
      items,
    };
  }) || [];
