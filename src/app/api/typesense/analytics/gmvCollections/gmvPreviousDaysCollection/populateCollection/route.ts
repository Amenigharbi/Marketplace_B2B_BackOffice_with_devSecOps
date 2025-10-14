import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextResponse, type NextRequest } from "next/server";
import { populateCollection } from "@/services/typesense/populateGmvPreviousDaysCollection/populateCollection";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const POST = async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const User = session.user as {
    id: string;
    roleId: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  try {
    const isGmvDaysCollectionExist = await typesense.isCollectionExist(
      "gmvPreviousDays",
    );

    if (isGmvDaysCollectionExist) {
      populateCollection();
      return NextResponse.json({
        message: "gmvPreviousDays Collection populating ...",
        status: 202,
      });
    }

    return NextResponse.json({
      message: "gmvPreviousDays Collection Doesn't Exist ...",
      status: 409,
    });
  } catch (error: any) {
    await createLog({
      type: "error",
      message: error.message || "Internal Server Error",
      context: {
        userId: User.id,
        username: User.username,
      },
      timestamp: new Date(),
      dataBefore: {},
      dataAfter: "error",
      id: "",
    });
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
