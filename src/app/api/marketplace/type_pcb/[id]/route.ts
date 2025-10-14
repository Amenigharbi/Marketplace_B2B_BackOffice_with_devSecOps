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

    // Check if user is KamiounAdminMaster or has required permission
    if (userRole?.name !== "KamiounAdminMaster") {
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
          rp.permission?.resource === "Type PCB" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Type PCB" },
          { status: 403 },
        );
      }
    }

    const typePcb = await prisma.typePcb.findUnique({
      where: { id: params.id },
      include: {
        products: true,
      },
    });
    if (!typePcb) {
      return NextResponse.json(
        { message: "TypePcb not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "TypePcb retrieved successfully", typePcb },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching TypePcb:", error);
    return NextResponse.json(
      { error: "Failed to retrieve TypePcb" },
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

    // Check if user is KamiounAdminMaster or has required permission
    if (userRole?.name !== "KamiounAdminMaster") {
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
          rp.permission?.resource === "Type PCB" &&
          rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for Type PCB" },
          { status: 403 },
        );
      }
    }

    const body = await req.json();
    const updatedTypePcb = await prisma.typePcb.update({
      where: { id: params.id },
      data: { name: body.name },
    });
    return NextResponse.json(
      { message: "TypePcb updated successfully", typePcb: updatedTypePcb },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating TypePcb:", error);
    return NextResponse.json(
      { error: "Failed to update TypePcb" },
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

    // Check if user is KamiounAdminMaster or has required permission
    if (userRole?.name !== "KamiounAdminMaster") {
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
          rp.permission?.resource === "Type PCB" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Type PCB" },
          { status: 403 },
        );
      }
    }

    await prisma.typePcb.delete({ where: { id: params.id } });
    return NextResponse.json(
      { message: "TypePcb deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting TypePcb:", error);
    return NextResponse.json(
      { error: "Failed to delete TypePcb" },
      { status: 500 },
    );
  }
}
