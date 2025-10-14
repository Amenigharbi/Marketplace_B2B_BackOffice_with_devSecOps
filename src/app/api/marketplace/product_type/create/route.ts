// app/api/productTypes/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new ProductType
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

    // Get user's role
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
          rp.permission?.resource === "Product Type" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          {
            message: "Forbidden: missing 'create' permission for Product Type",
          },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    // Validate required type field
    if (!body.type?.trim()) {
      return NextResponse.json(
        { message: "Product type name is required" },
        { status: 400 },
      );
    }

    const existingData = await prisma.productType.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Type Product",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Type Product",
          },
        });
      }
    }

    // Check if the product type already exists
    const existingProductType = await prisma.productType.findUnique({
      where: { type: body.type.trim() },
    });

    if (existingProductType) {
      return NextResponse.json(
        { message: "Product type already exists" },
        { status: 409 },
      );
    }

    // Create the new ProductType
    const newProductType = await prisma.productType.create({
      data: {
        type: body.type.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Product type created successfully",
        productType: newProductType,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ProductType:", error);
    return NextResponse.json(
      { error: "Failed to create ProductType" },
      { status: 500 },
    );
  }
}
