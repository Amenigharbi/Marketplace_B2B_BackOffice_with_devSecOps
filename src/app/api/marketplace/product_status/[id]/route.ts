// app/api/productStatuses/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve a specific ProductStatus
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    const { id } = params;
    const productStatus = await prisma.productStatus.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!productStatus) {
      return NextResponse.json(
        { message: "ProductStatus not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ productStatus }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving ProductStatus:", error);
    return NextResponse.json(
      { error: "Failed to retrieve ProductStatus" },
      { status: 500 },
    );
  }
}

// PUT: Update a ProductStatus
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
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

      const canUpdate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Product Status" &&
          rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          {
            message:
              "Forbidden: missing 'update' permission for Product Status",
          },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const { name, actif } = await req.json();

    if (!name || typeof actif === "undefined") {
      return NextResponse.json(
        { error: "Name and actif status are required" },
        { status: 400 },
      );
    }

    const updatedProductStatus = await prisma.productStatus.update({
      where: { id },
      data: { name, actif },
    });

    return NextResponse.json(
      {
        message: "ProductStatus updated successfully",
        productStatus: updatedProductStatus,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating ProductStatus:", error);
    return NextResponse.json(
      { error: "Failed to update ProductStatus" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a ProductStatus
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

      const canDelete = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Product Status" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          {
            message:
              "Forbidden: missing 'delete' permission for Product Status",
          },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    await prisma.productStatus.delete({ where: { id } });

    return NextResponse.json(
      { message: "ProductStatus deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting ProductStatus:", error);
    return NextResponse.json(
      { error: "Failed to delete ProductStatus" },
      { status: 500 },
    );
  }
}
