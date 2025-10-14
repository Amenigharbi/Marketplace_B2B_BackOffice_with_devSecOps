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
          rp.permission?.resource === "Type Partner" &&
          rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Type Partner" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const typePartner = await prisma.typePartner.findUnique({
      where: { id },
      include: {
        partners: true,
      },
    });

    if (!typePartner) {
      return NextResponse.json(
        { message: "TypePartner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "TypePartner retrieved successfully", typePartner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching TypePartner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve TypePartner" },
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
          rp.permission?.resource === "Type Partner" &&
          rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          {
            message: "Forbidden: missing 'update' permission for Type Partner",
          },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const body = await req.json();

    // Validate required name field
    if (!body.name?.trim()) {
      return NextResponse.json(
        { message: "Partner type name is required" },
        { status: 400 },
      );
    }

    // Check if another TypePartner with the same name exists (excluding current)
    const existingTypePartner = await prisma.typePartner.findFirst({
      where: {
        name: body.name.trim(),
        NOT: {
          id: id,
        },
      },
    });

    if (existingTypePartner) {
      return NextResponse.json(
        { message: "TypePartner with this name already exists" },
        { status: 409 },
      );
    }

    const updatedTypePartner = await prisma.typePartner.update({
      where: { id },
      data: { ...body, name: body.name.trim() },
    });

    return NextResponse.json(
      {
        message: "TypePartner updated successfully",
        typePartner: updatedTypePartner,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating TypePartner:", error);
    return NextResponse.json(
      { error: "Failed to update TypePartner" },
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
          rp.permission?.resource === "Type Partner" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          {
            message: "Forbidden: missing 'delete' permission for Type Partner",
          },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    await prisma.typePartner.delete({ where: { id } });

    return NextResponse.json(
      { message: "TypePartner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting TypePartner:", error);
    return NextResponse.json(
      { error: "Failed to delete TypePartner" },
      { status: 500 },
    );
  }
}
