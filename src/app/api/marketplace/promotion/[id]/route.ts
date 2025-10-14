// app/api/promotions/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    // Get user's role to check if they're KamiounAdminMaster
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // If user is KamiounAdminMaster, allow access
    if (userRole?.name === "KamiounAdminMaster") {
      const { id } = params;
      const promotion = await prisma.promotion.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!promotion) {
        return NextResponse.json(
          { message: "Promotion not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { message: "Promotion retrieved successfully", promotion },
        { status: 200 },
      );
    }

    // For non-KamiounAdminMaster users, check permissions
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
        rp.permission?.resource === "Promotion" && rp.actions.includes("read"),
    );

    if (!canCreate) {
      return NextResponse.json(
        { message: "Forbidden: missing 'read' permission for Promotion" },
        { status: 403 },
      );
    }

    const { id } = params;
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!promotion) {
      return NextResponse.json(
        { message: "Promotion not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Promotion retrieved successfully", promotion },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return NextResponse.json(
      { error: "Failed to retrieve promotion" },
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    // Get user's role to check if they're KamiounAdminMaster
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // If user is not KamiounAdminMaster, check permissions
    if (userRole?.name !== "KamiounAdminMaster") {
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
          rp.permission?.resource === "Promotion" &&
          rp.actions.includes("update"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for Promotion" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const body = await req.json();

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date provided" },
        { status: 400 },
      );
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: {
        startDate,
        endDate,
        promoPrice: body.promoPrice,
      },
    });

    return NextResponse.json(
      {
        message: "Promotion updated successfully",
        promotion: updatedPromotion,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    // Get user's role to check if they're KamiounAdminMaster
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // If user is not KamiounAdminMaster, check permissions
    if (userRole?.name !== "KamiounAdminMaster") {
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
          rp.permission?.resource === "Promotion" &&
          rp.actions.includes("delete"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Promotion" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json(
      { message: "Promotion deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 },
    );
  }
}
