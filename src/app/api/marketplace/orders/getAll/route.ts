import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // let user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // // Get user's role to check if they're KamiounAdminMaster
    // const userRole = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    // });

    // // Allow access if user is KamiounAdminMaster
    // const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    // if (!isKamiounAdminMaster) {
    //   if (!user.mRoleId) {
    //     return NextResponse.json({ message: "No role found" }, { status: 403 });
    //   }

    //   const rolePermissions = await prisma.rolePermission.findMany({
    //     where: {
    //       roleId: user.mRoleId,
    //     },
    //     include: {
    //       permission: true,
    //     },
    //   });

    //   const canRead = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Order" && rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'read' permission for Order" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const offset = (page - 1) * limit;
    const searchById = url.searchParams.get("searchById");
    const statusId = url.searchParams.get("statusId");
    const stateId = url.searchParams.get("stateId");
    const customerId = url.searchParams.get("customerId");
    const agentId = url.searchParams.get("agentId");
    const partnerId = url.searchParams.get("partnerId");
    const paymentMethodId = url.searchParams.get("paymentMethodId");
    const fromMobile = url.searchParams.get("fromMobile");
    const isActive = url.searchParams.get("isActive");
    const minAmountExclTax = url.searchParams.get("minAmountExclTax");
    const maxAmountExclTax = url.searchParams.get("maxAmountExclTax");
    const minAmountTTC = url.searchParams.get("minAmountTTC");
    const maxAmountTTC = url.searchParams.get("maxAmountTTC");
    const minAmountBeforePromo = url.searchParams.get("minAmountBeforePromo");
    const maxAmountBeforePromo = url.searchParams.get("maxAmountBeforePromo");
    const minAmountAfterPromo = url.searchParams.get("minAmountAfterPromo");
    const maxAmountAfterPromo = url.searchParams.get("maxAmountAfterPromo");
    const minAmountRefunded = url.searchParams.get("minAmountRefunded");
    const maxAmountRefunded = url.searchParams.get("maxAmountRefunded");
    const minAmountCanceled = url.searchParams.get("minAmountCanceled");
    const maxAmountCanceled = url.searchParams.get("maxAmountCanceled");
    const minAmountOrdered = url.searchParams.get("minAmountOrdered");
    const maxAmountOrdered = url.searchParams.get("maxAmountOrdered");
    const minAmountShipped = url.searchParams.get("minAmountShipped");
    const maxAmountShipped = url.searchParams.get("maxAmountShipped");
    const minLoyaltyPtsValue = url.searchParams.get("minLoyaltyPtsValue");
    const maxLoyaltyPtsValue = url.searchParams.get("maxLoyaltyPtsValue");
    const minWeight = url.searchParams.get("minWeight");
    const maxWeight = url.searchParams.get("maxWeight");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const shippingMethod = url.searchParams.get("shippingMethod");

    if (searchById && !/^[0-9a-fA-F]{24}$/.test(searchById)) {
      return NextResponse.json(
        { message: "Invalid order ID format." },
        { status: 400 },
      );
    }

    const whereClause: any = {
      ...(searchById && { id: searchById }),
      ...(statusId && { statusId }),
      ...(stateId && { stateId }),
      ...(customerId && { customerId }),
      ...(agentId && { agentId: agentId === "none" ? null : agentId }),
      ...(partnerId && { partnerId }),
      ...(paymentMethodId && { paymentMethodId }),
      ...(fromMobile && { fromMobile: fromMobile === "true" }),
      ...(isActive && { isActive: isActive === "true" }),
      ...(minAmountExclTax && {
        amountExclTaxe: { gte: parseFloat(minAmountExclTax) },
      }),
      ...(maxAmountExclTax && {
        amountExclTaxe: { lte: parseFloat(maxAmountExclTax) },
      }),
      ...(minAmountTTC && { amountTTC: { gte: parseFloat(minAmountTTC) } }),
      ...(maxAmountTTC && { amountTTC: { lte: parseFloat(maxAmountTTC) } }),
      ...(minAmountBeforePromo && {
        amountBeforePromo: { gte: parseFloat(minAmountBeforePromo) },
      }),
      ...(maxAmountBeforePromo && {
        amountBeforePromo: { lte: parseFloat(maxAmountBeforePromo) },
      }),
      ...(minAmountAfterPromo && {
        amountAfterPromo: { gte: parseFloat(minAmountAfterPromo) },
      }),
      ...(maxAmountAfterPromo && {
        amountAfterPromo: { lte: parseFloat(maxAmountAfterPromo) },
      }),
      ...(minAmountRefunded && {
        amountRefunded: { gte: parseFloat(minAmountRefunded) },
      }),
      ...(maxAmountRefunded && {
        amountRefunded: { lte: parseFloat(maxAmountRefunded) },
      }),
      ...(minAmountCanceled && {
        amountCanceled: { gte: parseFloat(minAmountCanceled) },
      }),
      ...(maxAmountCanceled && {
        amountCanceled: { lte: parseFloat(maxAmountCanceled) },
      }),
      ...(minAmountOrdered && {
        amountOrdered: { gte: parseFloat(minAmountOrdered) },
      }),
      ...(maxAmountOrdered && {
        amountOrdered: { lte: parseFloat(maxAmountOrdered) },
      }),
      ...(minAmountShipped && {
        amountShipped: { gte: parseFloat(minAmountShipped) },
      }),
      ...(maxAmountShipped && {
        amountShipped: { lte: parseFloat(maxAmountShipped) },
      }),
      ...(minLoyaltyPtsValue && {
        loyaltyPtsValue: { gte: parseInt(minLoyaltyPtsValue) },
      }),
      ...(maxLoyaltyPtsValue && {
        loyaltyPtsValue: { lte: parseInt(maxLoyaltyPtsValue) },
      }),
      ...(minWeight && { weight: { gte: parseFloat(minWeight) } }),
      ...(maxWeight && { weight: { lte: parseFloat(maxWeight) } }),
      ...(dateFrom && { createdAt: { gte: new Date(dateFrom) } }),
      ...(dateTo && { createdAt: { lte: new Date(dateTo) } }),
      ...(shippingMethod && {
        shippingMethod: { contains: shippingMethod, mode: "insensitive" },
      }),
    };

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        status: true,
        state: true,
        customer: true,
        agent: true,
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
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalOrders = await prisma.order.count({ where: whereClause });

    return NextResponse.json(
      { message: "Orders retrieved", orders, totalOrders },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to retrieve orders" },
      { status: 500 },
    );
  }
}
