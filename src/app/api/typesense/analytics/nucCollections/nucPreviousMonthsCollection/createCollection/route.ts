import { createCollection } from "@/clients/typesense/createCollection";
import { nucPreviousMonthsCollectionSchema } from "@/clients/typesense/schemas/nucPreviousMonthsCollection";
import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const isNucCollectionExist = await typesense.isCollectionExist(
      "NucPreviousMonths",
    );

    if (!isNucCollectionExist) {
      await createCollection(nucPreviousMonthsCollectionSchema);
      return NextResponse.json({
        message: "nucPreviousMonths Collection Created Successfully",
        status: 200,
      });
    }

    return NextResponse.json({
      message: "NucPreviousMonths Collection Already  Exist ...",
      status: 409,
    });
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";
    if (message.includes("Request failed with HTTP code 404")) {
      return NextResponse.json(
        {
          error: "Collection Not Found.",
        },
        {
          status: 404,
        },
      );
    }

    responses.internalServerError(error);
  }
};
