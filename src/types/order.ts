import { z } from "zod";

const orderSchema = z.object({
  id: z.string(),
  kamiounId: z.string(),
  state: z.string(),
  status: z.string(),
  total: z.number(),
  createdAt: z.number(),
  customerId: z.string(),
  customerFirstname: z.string(),
  customerLastname: z.string(),
  deliveryAgentId: z.string(),
  deliveryAgentName: z.string(),
  deliveryDate: z.number(),
  deliveryStatus: z.string(),
  source: z.string(),
  items: z.array(z.any()),
});

export type Order = z.infer<typeof orderSchema>;
