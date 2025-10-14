import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const gmvPreviousMonthsCollectionSchema: CollectionCreateSchema = {
  name: "gmvPreviousMonths",
  enable_nested_fields: true,
  fields: [
    {
      name: "id",
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
  ],
};
