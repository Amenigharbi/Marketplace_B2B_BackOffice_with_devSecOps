// app/api/productStatuses/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all ProductStatuses with related Products
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
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

    // Get user's role to check if they're KamiounAdminMaster
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Allow access if user is KamiounAdminMaster
    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
      if (!user.mRoleId) {
        return NextResponse.json({ message: "No role found" }, { status: 403 });
      }

      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canRead = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Product Status" &&
          rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          {
            message: "Forbidden: missing 'read' permission for Product Status",
          },
          { status: 403 },
        );
      }
    }

    const productStatuses = await prisma.productStatus.findMany({
      include: {
        products: true, // Include related products
      },
    });

    if (productStatuses.length === 0) {
      return NextResponse.json(
        { message: "No ProductStatuses found", productStatuses: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "ProductStatuses retrieved successfully", productStatuses },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching ProductStatuses:", error);
    return NextResponse.json(
      { error: "Failed to retrieve ProductStatuses" },
      { status: 500 },
    );
  }
}
