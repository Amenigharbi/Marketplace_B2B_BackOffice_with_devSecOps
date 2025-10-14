import { magento } from "@/clients/magento";
import { formatDeliveryAgentsMagentoResponse } from "./formatDeliveryAgentsMegentoResponse";

export const getAllDeliveryAgents = async () => {
  const deliveryAgents = await magento.queries.getDeliveryAgents();

  return formatDeliveryAgentsMagentoResponse(deliveryAgents);
};
