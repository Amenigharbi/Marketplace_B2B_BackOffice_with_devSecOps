import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const nucPreviousMonthsCollectionSchema: CollectionCreateSchema = {
  name: "NucPreviousMonths",
  enable_nested_fields: true,
  fields: [
    {
      name: "id",
      type: "string",
    },
    {
      name: "year",
      type: "string",
    },
    {
      name: "month",
      type: "string",
    },
    {
      name: "nuc",
      type: "int32",
    },
    {
      name: "customersIds",
      type: "string[]",
    },
  ],
};
