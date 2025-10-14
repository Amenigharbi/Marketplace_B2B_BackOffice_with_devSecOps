import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const gmvPreviousDaysCollectionSchema: CollectionCreateSchema = {
  name: "gmvPreviousDays",
  enable_nested_fields: true,
  fields: [
    {
      name: "id",
      type: "string",
    },
    {
      name: "day",
      type: "string",
    },
    {
      name: "month",
      type: "string",
    },
    {
      name: "year",
      type: "string",
    },
    {
      name: "gmv",
      type: "float",
    },
    {
      name: "week",
      type: "string",
    },
  ],
};
