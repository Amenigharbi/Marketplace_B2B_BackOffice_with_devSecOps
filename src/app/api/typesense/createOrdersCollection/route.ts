import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";
import { createLog } from "../../../../clients/prisma/getLogs";
import { auth } from "../../../../services/auth";

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
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return responses.unauthorized();
    }

    const isOrdersCollectionExist = await typesense.isCollectionExist("orders");

    if (!isOrdersCollectionExist) {
      await typesense.orders.createCollection();
      return NextResponse.json({
        message: "Orders Collection Created Successfully",
        status: 200,
      });
    }

    return NextResponse.json({
      message: "Orders Collection Already  Exist ...",
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
