import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

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
      where: { id: user.mRoleId }, // Changed from roleId to mRoleId
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
          rp.permission?.resource === "Permission" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Permission" },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.permission.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Permission",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Permission",
          },
        });
      }
    }

    const { resource } = body;

    if (!resource) {
      return NextResponse.json(
        { error: "resource is required." },
        { status: 400 },
      );
    }

    const newPermission = await prisma.permission.create({
      data: { resource },
    });

    return NextResponse.json(
      { message: "Permission created successfully", permission: newPermission },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating permission:", error);
    return NextResponse.json(
      { error: "Failed to create permission" },
      { status: 500 },
    );
  }
}
