import { createCollection } from "@/clients/typesense/createCollection";
import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schemas/gmvPreviousDaysCollection";
import { NextRequest } from "next/server";
import {
  successResponse,
  conflictResponse,
  invalidRequestResponse,
  internalServerErrorResponse,
} from "src/utils/responses/typesenseResponses/CollectionHandlingResponse";

export const POST = async (request: NextRequest) => {
  const result: any = await createCollection(gmvPreviousDaysCollectionSchema);

  if (result.success) {
    return successResponse(
      gmvPreviousDaysCollectionSchema.name + " created successfully.",
    );
  }

  switch (result.message) {
    case "conflict":
      return conflictResponse();
    case "internal_server_error":
      return internalServerErrorResponse();
    default:
      return invalidRequestResponse(result.message);
  }
};
