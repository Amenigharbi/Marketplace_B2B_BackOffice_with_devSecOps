import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET a specific permission (including roles)
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
          rp.permission?.resource === "Permission" &&
          rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Permission" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!permission) {
      return NextResponse.json(
        { message: "Permission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Permission retrieved successfully", permission },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching permission:", error);
    return NextResponse.json(
      { error: "Failed to retrieve permission" },
      { status: 500 },
    );
  }
}

// PATCH - update permission resource
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
          rp.permission?.resource === "Permission" &&
          rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for Permission" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const body = await req.json();
    const { resource } = body;

    if (!resource || typeof resource !== "string") {
      return NextResponse.json(
        { error: "'resource' must be valid string." },
        { status: 400 },
      );
    }

    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: { resource },
    });

    return NextResponse.json(
      {
        message: "Permission updated successfully",
        permission: updatedPermission,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating permission:", error);
    return NextResponse.json(
      { error: "Failed to update permission" },
      { status: 500 },
    );
  }
}

// DELETE - delete permission
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
          rp.permission?.resource === "Permission" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Permission" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    await prisma.permission.delete({ where: { id } });

    return NextResponse.json(
      { message: "Permission deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting permission:", error);
    return NextResponse.json(
      { error: "Failed to delete permission" },
      { status: 500 },
    );
  }
}
