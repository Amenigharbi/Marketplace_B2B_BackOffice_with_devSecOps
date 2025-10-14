import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextResponse, type NextRequest } from "next/server";
import { deleteCollection } from "@/clients/typesense/deleteCollection";

export const DELETE = async (request: NextRequest) => {
  try {
    console.info("NucPreviousMonths Collection delete ...");

    await deleteCollection("NucPreviousMonths");

    console.info("NucPreviousMonths Collection deleted successfully ");

    return NextResponse.json({
      message: "NucPreviousMonths Collection Deleted Successfully ...",
      status: 200,
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
