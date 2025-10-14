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
          rp.permission?.resource === "Type PCB" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Type PCB" },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.typePcb.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Type PCB",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Type PCB",
          },
        });
      }
    }

    const existingTypePcb = await prisma.typePcb.findUnique({
      where: { name: body.name },
    });
    if (existingTypePcb) {
      return NextResponse.json(
        { message: "TypePcb with this name already exists" },
        { status: 409 },
      );
    }

    const newTypePcb = await prisma.typePcb.create({
      data: { name: body.name },
    });
    return NextResponse.json(
      { message: "TypePcb created successfully", typePcb: newTypePcb },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating TypePcb:", error);
    return NextResponse.json(
      { error: "Failed to create TypePcb" },
      { status: 500 },
    );
  }
}
