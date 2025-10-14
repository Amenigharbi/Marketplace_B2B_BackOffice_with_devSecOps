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

    let user = session.user as {
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
      where: {
        id: user.mRoleId, // Changed from roleId to mRoleId
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

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Role" && rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Role" },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.role.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Role",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Role",
          },
        });
      }
    }

    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Invalid request: 'name' is required." },
        { status: 400 },
      );
    }

    // Check if the role with the given name already exists
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      return NextResponse.json(
        { message: `Role with name '${name}' already exists.` },
        { status: 400 },
      );
    }

    const newRole = await prisma.role.create({
      data: { name },
    });

    return NextResponse.json(
      { message: "Role created successfully", role: newRole },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 },
    );
  }
}
