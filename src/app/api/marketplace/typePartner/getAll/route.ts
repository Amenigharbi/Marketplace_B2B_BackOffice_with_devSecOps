import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
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

    const typePartners = await prisma.typePartner.findMany({
      include: {
        partners: true,
      },
    });

    return NextResponse.json(
      { message: "TypePartners retrieved successfully", typePartners },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching TypePartners:", error);
    return NextResponse.json(
      { error: "Failed to retrieve TypePartners" },
      { status: 500 },
    );
  }
}
