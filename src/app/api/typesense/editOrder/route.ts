import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";
import { getOrderProductsNames } from "@/services/typesense/getOrderProductsNames";
import { convertIsoDateToUnixTimestamp } from "@/utils/date/convertIsoDateToUnixTimestamp";
import { createLog } from "../../../../clients/prisma/getLogs";
import { auth } from "../../../../services/auth";
// function findExtraFields(order: any, predefinedFields: string[]): string[] {
//   // Get the keys of the order object
//   const orderKeys = Object.keys(order);

//   // Find keys that are not in the predefinedFields list
//   const extraFields = orderKeys.filter(
//     (key) => !predefinedFields.includes(key),
//   );

//   // Return an array containing only the names of the extra fields
//   return extraFields;
// }

// const list = [
//   "deliveryDate",
//   "id",
//   "state",
//   "status",
//   "total",
//   "deliveryAgentId",
//   "deliveryAgentName",
//   "deliverySlot",
//   "deliveryStatus",
//   "items",
// ];

const webSocketApiUrl = process.env.WEBSOCKET_API_URL;
export const PUT = async (request: NextRequest) => {
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
  // Only update  : deliveryDate, items, state,status,   deliverySlot,
  try {
    const isAuthorized = await checkApiKey(request);

    if (!isAuthorized) {
      return responses.unauthorized();
    }

    const { order } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }

    if (!order?.id) {
      return responses.invalidRequest("order id  is Required");
    }

    // if (order) {
    //   const fields = findExtraFields(order, list);

    //   if (fields?.length) {
    //     return responses.invalidRequest(
    //       "you can't update those fields : " + "[" + fields + "]",
    //     );
    //   }
    // }

    const unixTimestamp = Math.floor(Date.now() / 1000);

    if (order?.status) {
      await typesense.orders.updateOne({
        id: order?.id,
        updatedAt: unixTimestamp,
        status: order?.status,
      });
    }
    if (order?.state) {
      await typesense.orders.updateOne({
        id: order?.id,
        updatedAt: unixTimestamp,
        state: order?.state,
      });
    }

    if (order?.deliverySlot) {
      await typesense.orders.updateOne({
        id: order?.id,
        updatedAt: unixTimestamp,
        deliverySlot: order?.deliverySlot,
      });
    }

    if (order?.deliveryAgentId) {
      await typesense.orders.updateOne({
        id: order?.id,
        updatedAt: unixTimestamp,
        deliveryAgentId: order?.deliveryAgentId,
      });
    }

    if (order?.deliveryAgentName) {
      await typesense.orders.updateOne({
        id: order?.id,
        updatedAt: unixTimestamp,
        deliveryAgentName: order?.deliveryAgentName,
      });
    }
    if (order?.deliverySlot) {
      await typesense.orders.updateOne({
        id: order?.id,
        updatedAt: unixTimestamp,
        deliverySlot: order?.deliverySlot,
      });
    }

    if (order?.deliveryDate) {
      await typesense.orders.updateOne({
        id: order?.id,
        updatedAt: unixTimestamp,
        deliveryDate:
          convertIsoDateToUnixTimestamp(order?.deliveryDate) || unixTimestamp,
      });
    }

    if (order?.items?.length) {
      await typesense.orders.updateOne({
        id: order?.id,
        updatedAt: unixTimestamp,
        items: order?.items,
        productsNames: getOrderProductsNames(order?.items),
      });
    }

    order["action"] = "Update";

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
        message: "Order successfully updated.",
        orderId: order?.id,
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

    return responses.internalServerError(error);
  }
};
