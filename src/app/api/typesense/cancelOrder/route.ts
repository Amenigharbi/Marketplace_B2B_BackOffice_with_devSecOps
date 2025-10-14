import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return responses.unauthorized();
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return responses.invalidRequest("orderId is Required");
    }

    await typesense.orders.cancelOne(orderId);

    return NextResponse.json(
      {
        message: "Order Canceled Successfully.",
        orderId: orderId,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    logError(error);

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 404")) {
      const parts = message.split("with id:");

      const id = parts[1].trim();

      return NextResponse.json(
        {
          error: "Order not found.",
          orderId: id,
        },
        {
          status: 404,
        },
      );
    }

    if (message.includes("Request failed with HTTP code 400")) {
      const parts = message.split("Server said:");

      const serverSaidPart = parts[1].trim();

      return responses.invalidRequest(serverSaidPart);
    }

    return responses.internalServerError(error);
  }
};
