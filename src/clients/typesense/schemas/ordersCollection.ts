import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const typesenseOrdersCollectionSchema: CollectionCreateSchema = {
  name: "orders",
  enable_nested_fields: true,
  default_sorting_field: "createdAt",
  fields: [
    {
      name: "id",
      type: "string",
    },
    {
      name: "orderId",
      type: "string",
    },
    {
      name: "incrementId",
      type: "string",
    },
    {
      name: "kamiounId",
      type: "string",
    },
    {
      name: "storeId",
      type: "string",
    },
    {
      name: "state",
      type: "string",
    },
    {
      name: "status",
      type: "string",
    },
    {
      name: "total",
      type: "float",
    },
    {
      name: "createdAt",
      type: "int64",
      range_index: true,
    },
    {
      name: "updatedAt",
      type: "int64",
      range_index: true,
    },
    {
      name: "customerId",
      type: "string",
    },
    {
      name: "customerFirstname",
      type: "string",
      sort: true,
    },
    {
      name: "customerLastname",
      type: "string",
    },
    {
      name: "customerPhone",
      type: "string",
      optional: true,
    },
    {
      name: "deliveryAgentId",
      type: "string",
      optional: true,
    },
    {
      name: "deliveryAgentName",
      type: "string",
      optional: true,
    },
    {
      name: "deliverySlot",
      type: "string",
      optional: true,
    },
    {
      name: "deliveryDate",
      type: "int64",
      optional: true,
      range_index: true,
    },
    {
      name: "deliveryStatus",
      type: "string",
      optional: true,
    },
    {
      name: "source",
      type: "string",
      optional: true,
    },
    {
      name: "productsNames",
      type: "string[]",
      optional: true,
    },

    {
      name: "items",
      type: "auto",
      optional: true,
    },
  ],
};
