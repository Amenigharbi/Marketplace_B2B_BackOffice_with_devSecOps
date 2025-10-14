// app/api/productStatuses/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new ProductStatus
export async function POST(req: Request) {
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

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Product Status" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          {
            message:
              "Forbidden: missing 'create' permission for Product Status",
          },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.productStatus.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Product Status",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Product Status",
          },
        });
      }
    }

    // Check if the product status already exists by name
    const existingProductStatus = await prisma.productStatus.findUnique({
      where: { name: body.name },
    });

    if (existingProductStatus) {
      return NextResponse.json(
        { message: "Product status with this name already exists" },
        { status: 409 },
      );
    }

    // Create the new ProductStatus
    const newProductStatus = await prisma.productStatus.create({
      data: {
        name: body.name,
        actif: body.actif ?? true, // Default to true if not provided
      },
    });

    return NextResponse.json(
      {
        message: "Product status created successfully",
        productStatus: newProductStatus,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ProductStatus:", error);
    return NextResponse.json(
      { error: "Failed to create ProductStatus" },
      { status: 500 },
    );
  }
}
