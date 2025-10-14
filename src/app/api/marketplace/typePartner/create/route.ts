import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new TypePartner
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

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Type Partner" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          {
            message: "Forbidden: missing 'create' permission for Type Partner",
          },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    // Validate required name field
    if (!body.name?.trim()) {
      return NextResponse.json(
        { message: "Partner type name is required" },
        { status: 400 },
      );
    }

    const existingData = await prisma.typePartner.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Type Partner",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Type Partner",
          },
        });
      }
    }

    // Check if TypePartner already exists
    const existingTypePartner = await prisma.typePartner.findUnique({
      where: { name: body.name.trim() },
    });
    if (existingTypePartner) {
      return NextResponse.json(
        { message: "TypePartner with this name already exists" },
        { status: 409 },
      );
    }

    // Create new TypePartner
    const newTypePartner = await prisma.typePartner.create({
      data: { name: body.name.trim() },
    });

    return NextResponse.json(
      {
        message: "TypePartner created successfully",
        typePartner: newTypePartner,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating TypePartner:", error);
    return NextResponse.json(
      { error: "Failed to create TypePartner" },
      { status: 500 },
    );
  }
}
