import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { httpRequestsTotal } from "@/libs/metrics";

const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 30000,
    timeout: 30000,
  },
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        status: true,
        state: true,
        customer: true,
        agent: true,
        reservation: true,
        orderItems: {
          include: {
            product: { select: { id: true, name: true } },
            source: { select: { id: true, name: true } },
            partner: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        loyaltyPoints: true,
        paymentMethod: true,
      },
    });

    if (!order) {
      httpRequestsTotal.inc({
        method: "GET",
        route: "/api/marketplace/orders/[id]",
        code: 404,
      });
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    httpRequestsTotal.inc({
      method: "GET",
      route: "/api/marketplace/orders/[id]",
      code: 200,
    });
    return NextResponse.json(
      { message: "Order retrieved", order },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    httpRequestsTotal.inc({
      method: "GET",
      route: "/api/marketplace/orders/[id]",
      code: 500,
    });
    return NextResponse.json(
      { error: "Failed to retrieve order" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      httpRequestsTotal.inc({
        method: "PATCH",
        route: "/api/marketplace/orders/[id]",
        code: 401,
      });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    const { id } = params;
    const body = await req.json();

    const {
      id: _,
      createdAt,
      updatedAt,
      reservation,
      loyaltyPoints,
      mainOrderId,
      ...updateData
    } = body;

    // Handle relation connections
    if (body.statusId) {
      updateData.status = { connect: { id: body.statusId } };
      delete updateData.statusId;
    }
    if (body.stateId) {
      updateData.state = { connect: { id: body.stateId } };
      delete updateData.stateId;
    }
    if (body.customerId) {
      updateData.customer = { connect: { id: body.customerId } };
      delete updateData.customerId;
    }
    if (body.agentId) {
      updateData.agent = { connect: { id: body.agentId } };
      delete updateData.agentId;
    }
    if (body.paymentMethodId) {
      updateData.paymentMethod = { connect: { id: body.paymentMethodId } };
      delete updateData.paymentMethodId;
    }

    // Handle reservationId properly
    if (body.reservationId) {
      if (body.reservationId === null) {
        updateData.reservation = { disconnect: true };
      } else {
        updateData.reservation = { connect: { id: body.reservationId } };
      }
      delete updateData.reservationId;
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
            source: true,
          },
        },
        status: true,
      },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return await prisma.$transaction(async (tx) => {
      if (body.orderItems) {
        updateData.orderItems = {
          updateMany: body.orderItems.map((item: any) => ({
            where: { id: item.id },
            data: {
              qteOrdered: item.qteOrdered,
              qteRefunded: item.qteRefunded,
              qteShipped: item.qteShipped,
              qteCanceled: item.qteCanceled,
              discountedPrice: item.discountedPrice,
              weight: item.weight,
              sku: item.sku,
              sourceId: item.sourceId,
              customerId: item.customerId,
              partnerId: item.partnerId,
            },
          })),
        };
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: updateData,
      });

      const notificationData = {
        id: `${id}-${Date.now()}`,
        name: `${user.firstName} ${user.lastName}`,
        message: `Order #${id} was updated by ${user.firstName} ${user.lastName}`,
        time: new Date().toLocaleString(),
      };

      httpRequestsTotal.inc({
        method: "PATCH",
        route: "/api/marketplace/orders/[id]",
        code: 200,
      });
      return NextResponse.json(
        {
          message: "Order updated",
          order: updatedOrder,
          notification: notificationData,
        },
        { status: 200 },
      );
    });
  } catch (error) {
    console.error("Error updating order:", error);
    httpRequestsTotal.inc({
      method: "PATCH",
      route: "/api/marketplace/orders/[id]",
      code: 500,
    });
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.orderItem.deleteMany({
      where: { orderId: params.id },
    });

    const deletedOrder = await prisma.order.delete({
      where: { id: params.id },
    });

    httpRequestsTotal.inc({
      method: "DELETE",
      route: "/api/marketplace/orders/[id]",
      code: 200,
    });
    return NextResponse.json(
      { message: "Order deleted successfully", order: deletedOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    httpRequestsTotal.inc({
      method: "DELETE",
      route: "/api/marketplace/orders/[id]",
      code: 500,
    });
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 },
    );
  }
}
