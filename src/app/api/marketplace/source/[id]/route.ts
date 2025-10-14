import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET a specific source
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
      userType?: string;
    };

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: {
        id: user.mRoleId,
      },
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
          rp.permission?.resource === "Source" && rp.actions.includes("read"),
      );

      if (!canRead) {
        return NextResponse.json(
          { message: "Forbidden: missing 'read' permission for Source" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    // If user is a partner, only allow access to their own sources
    let whereClause: any = { id };
    if (user.userType === "partner") {
      whereClause.partnerId = user.id;
    }

    const source = await prisma.source.findFirst({
      where: whereClause,
      include: {
        partner: true,
        stock: true,
      },
    });

    if (!source) {
      return NextResponse.json(
        { message: "Source not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Source retrieved successfully", source },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching source:", error);
    return NextResponse.json(
      { error: "Failed to retrieve source" },
      { status: 500 },
    );
  }
}

// PATCH - update source
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
      userType?: string;
    };

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: {
        id: user.mRoleId,
      },
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
          rp.permission?.resource === "Source" && rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'update' permission for Source" },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Source name is required and must be a string." },
        { status: 400 },
      );
    }

    // If user is a partner, only allow updating their own sources
    let whereClause: any = { id };
    if (user.userType === "partner") {
      whereClause.partnerId = user.id;
    }

    // Check if the source exists and belongs to the partner
    const existingSource = await prisma.source.findFirst({
      where: whereClause,
    });

    if (!existingSource) {
      return NextResponse.json(
        { message: "Source not found" },
        { status: 404 },
      );
    }

    const updatedSource = await prisma.source.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(
      { message: "Source updated successfully", source: updatedSource },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating source:", error);
    return NextResponse.json(
      { error: "Failed to update source" },
      { status: 500 },
    );
  }
}

// DELETE - delete source
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
      userType?: string;
    };

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: {
        id: user.mRoleId,
      },
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
          rp.permission?.resource === "Source" && rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Source" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    // If user is a partner, only allow deleting their own sources
    let whereClause: any = { id };
    if (user.userType === "partner") {
      whereClause.partnerId = user.id;
    }

    // Check if the source exists and belongs to the partner
    const existingSource = await prisma.source.findFirst({
      where: whereClause,
    });

    if (!existingSource) {
      return NextResponse.json(
        { message: "Source not found" },
        { status: 404 },
      );
    }

    await prisma.source.delete({ where: { id } });

    return NextResponse.json(
      { message: "Source deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting source:", error);
    return NextResponse.json(
      { error: "Failed to delete source" },
      { status: 500 },
    );
  }
}
