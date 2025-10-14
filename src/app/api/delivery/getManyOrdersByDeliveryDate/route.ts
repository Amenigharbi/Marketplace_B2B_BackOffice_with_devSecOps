export const revalidate = 0;

import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { NextResponse, type NextRequest } from "next/server";
import { getOrdersByDeliveryDate } from "@/services/delivery/getOrdersByDeliveryDate";
import { createLog } from "../../../../clients/prisma/getLogs";
import { auth } from "../../../../services/auth";

export const GET = async (request: NextRequest) => {
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
    const { searchParams } = new URL(request.url);

    const storeId = searchParams.get("storeId");

    const deliveryDate = searchParams.get("deliveryDate");

    if (!deliveryDate) {
      return responses.invalidRequest("deliveryDate parameter is Required");
    }

    const res = await getOrdersByDeliveryDate({
      deliveryDate,
      storeId,
    });

    return NextResponse.json(res);
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

    return responses.internalServerError();
  }
};
