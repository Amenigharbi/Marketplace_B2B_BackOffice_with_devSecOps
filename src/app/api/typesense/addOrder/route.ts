import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";
import { getOrderProductsNames } from "@/services/typesense/getOrderProductsNames";
import { convertIsoDateToUnixTimestamp } from "@/utils/date/convertIsoDateToUnixTimestamp";
import { auth } from "../../../../services/auth";
import { createLog } from "../../../../clients/prisma/getLogs";

function getUnixTimestampTomorrow() {
  // Get the current date
  const today = new Date();

  // Create a new date object for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Convert the date object to a UNIX timestamp (in seconds)
  return Math.floor(tomorrow.getTime() / 1000);
}

function findMissingProperties(order: any) {
  const requiredProperties = [
    "id",
    "orderId",
    "incrementId",
    "kamiounId",
    "state",
    "status",
    "total",
    "createdAt",
    "customerId",
    "storeId",
    "customerFirstname",
    "customerLastname",
  ];

  const missingProperties = requiredProperties.filter((prop) => {
    return !order.hasOwnProperty(prop);
  });

  return missingProperties;
}

const webSocketApiUrl = process.env.WEBSOCKET_API_URL;

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

    const { order } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }

    if (order) {
      const missing = findMissingProperties(order);

      if (missing?.length) {
        return responses.invalidRequest(
          "those properties are missing :" + "[" + missing + "]",
        );
      }
    }
    const unixTimestamp = Math.floor(Date.now() / 1000);

    // if (!order.deliveryDate) {
    //   return responses.invalidRequest(
    //     "deliveryDate is required and must be a valid date.",
    //   );
    // }
    let delivdate = 0;
    const date = new Date(order.deliveryDate);
    if (isNaN(date.getTime())) {
      delivdate = getUnixTimestampTomorrow();
    } else {
      delivdate = Math.floor(date.getTime() / 1000);
    }
    const deliveryDate = delivdate;
    await typesense.orders.addOne({
      ...order,
      deliveryDate,
      createdAt:
        convertIsoDateToUnixTimestamp(order?.createdAt) || unixTimestamp,
      updatedAt: unixTimestamp,
      productsNames: getOrderProductsNames(order?.items),
    });

    order["action"] = "Created";

    await fetch(`${webSocketApiUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    }).catch((error) => {
      console.error("Error creating order:", error);
    });

    return NextResponse.json(
      {
        message: "Order successfully added.",
        orderId: order?.id,
      },
      {
        status: 200,
      },
    );
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

    if (message.includes("Request failed with HTTP code 409")) {
      return NextResponse.json(
        {
          error: "Order already exists.",
        },
        {
          status: 409,
        },
      );
    }

    if (message.includes("Request failed with HTTP code 400"))
      return responses.invalidRequest(message);

    return responses.internalServerError(error);
  }
};
