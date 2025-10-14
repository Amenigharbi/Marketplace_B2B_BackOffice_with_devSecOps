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

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Source" && rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Source" },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.source.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Source",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Source",
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

    let partnerId;
    if (user.userType === "partner") {
      partnerId = user.id;
    } else {
      // For admin users, get the partnerId from the request body
      partnerId = body.partnerId;

      if (!partnerId) {
        return NextResponse.json(
          {
            message:
              "Invalid request: 'partnerId' is required for admin users.",
          },
          { status: 400 },
        );
      }
    }

    // Check if the source with the given name already exists for this partner
    const existingSource = await prisma.source.findFirst({
      where: {
        name,
        partnerId,
      },
    });

    if (existingSource) {
      return NextResponse.json(
        {
          message: `Source with name '${name}' already exists for this partner.`,
        },
        { status: 400 },
      );
    }

    const newSource = await prisma.source.create({
      data: {
        name,
        partnerId,
      },
    });

    return NextResponse.json(
      { message: "Source created successfully", source: newSource },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating source:", error);
    return NextResponse.json(
      { error: "Failed to create source" },
      { status: 500 },
    );
  }
}
