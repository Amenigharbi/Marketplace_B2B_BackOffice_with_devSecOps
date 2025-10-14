// app/api/productTypes/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all ProductTypes
export async function GET(req: Request) {
  try {
    //Session Authorization
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    //Permission Check
    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    if (!user.mRoleId) {
      return NextResponse.json({ message: "No role found" }, { status: 403 });
    }

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Allow access if user is KamiounAdminMaster
    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
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
          rp.permission?.resource === "Product Type" &&
          rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Product Type" },
          { status: 403 },
        );
      }
    }

    const productTypes = await prisma.productType.findMany({
      include: {
        products: true,
      },
    }); // Retrieve all ProductTypes

    if (productTypes.length === 0) {
      return NextResponse.json(
        { message: "No ProductTypes found", productTypes: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "ProductTypes retrieved successfully", productTypes },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching ProductTypes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve ProductTypes" },
      { status: 500 },
    );
  }
}
