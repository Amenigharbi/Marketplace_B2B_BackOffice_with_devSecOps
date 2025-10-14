import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { typesense } from "@/clients/typesense";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/clients/prisma";
import { createMilkRunAuditLog } from "@/services/auditing/milkRun";
import { magento } from "@/clients/magento";
import { auth } from "../../../../services/auth";
import { createLog } from "@/clients/prisma/getLogs";

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
  let storeId = "";
  try {
    const { order, username } = await request.json();

    if (!order) {
      return responses.invalidRequest("order is Required");
    }

    if (!order?.id) {
      return responses.invalidRequest("id is Required");
    }

    if (!order?.deliverySlot) {
      return responses.invalidRequest("deliverySlot is Required");
    }

    if (!order?.deliveryAgentId) {
      return responses.invalidRequest("deliveryAgentId  is Required");
    }

    if (!order?.deliveryAgentName) {
      return responses.invalidRequest("deliveryAgentName  is Required");
    }
    if (!username) {
      return responses.invalidRequest("username is Required");
    }

    const sorder: any = await typesense.orders.getOne(order.id);

    await magento.mutations.editOrderMilkRun({
      orderId: order?.id,
      deliverySlot: order?.deliverySlot,
      deliveryAgentName: order?.deliveryAgentName,
      deliveryAgentId: order?.deliveryAgentId,
      status: sorder?.status,
      state: sorder?.state,
    });

    await typesense.orders.updateOne(order);
    const Order: any = await typesense.orders.getOne(order.id);

    const dbUser = await prisma.getUser(username);
    await createLog({
      type: "milk run",
      message: `milk run updated for order `,
      context: JSON.stringify({
        userId: User?.id,
        username: User.username,
        storeId: sorder.storeId,
      }),
      timestamp: new Date(),
      dataBefore: {
        orderId: sorder?.id,
        storeId: sorder?.storeId,
        agentId: sorder?.deliveryAgentId,
        agentName: sorder?.deliveryAgentName,
        deliveryDate: sorder?.deliverySlot,
        status: sorder?.status,
      },
      dataAfter: {
        orderId: Order?.id,
        storeId: Order?.storeId,
        agentId: Order?.deliveryAgentId,
        agentName: Order?.deliveryAgentName,
        deliveryDate: Order?.deliverySlot,
        status: sorder.status,
      },
      id: order?.id,
    });

    /* await createMilkRunAuditLog({
      username: dbUser?.username ?? "",
      userId: dbUser?.id ?? "",
      action: `${username} edit order`,
      actionTime: new Date(),
      orderId: order?.id,
      storeId: "0",
      agentId: order?.deliveryAgentId,
      agentName: order?.deliveryAgentName,
      deliveryDate: order.deliveryDate ? order.deliveryDate.toString() : 'N/A',
    });*/

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
    await createLog({
      type: "error",
      message: error.message || "Internal Server Error",
      context: {
        userId: User?.id,
        username: User.username,
        storeId: storeId,
      },
      timestamp: new Date(),
      dataBefore: {},
      dataAfter: "error",
      id: "",
    });
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
