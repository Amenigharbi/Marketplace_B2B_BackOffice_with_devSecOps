// app/api/settings/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create new Settings
export async function POST(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // const user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // // Get user's role
    // const userRole = await prisma.role.findFirst({
    //   where: { id: user.mRoleId },
    // });

    // // Allow access if user is KamiounAdminMaster
    // const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    // if (!isKamiounAdminMaster) {
    //   if (!user.mRoleId) {
    //     return NextResponse.json({ message: "No role found" }, { status: 403 });
    //   }

    //   const rolePermissions = await prisma.rolePermission.findMany({
    //     where: {
    //       roleId: user.mRoleId,
    //     },
    //     include: {
    //       permission: true,
    //     },
    //   });

    //   const canCreate = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Settings" &&
    //       rp.actions.includes("create"),
    //   );

    //   if (!canCreate) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'create' permission for Settings" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const body = await req.json();

    // Check if any settings exist
    const existingSettings = await prisma.settings.findFirst();

    // If this is the first settings being created, create the Settings permission
    if (!existingSettings) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Settings",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Settings",
          },
        });
      }
    }

    // Create the Settings in the database
    const newSettings = await prisma.settings.create({
      data: {
        deliveryType: body.deliveryType,
        deliveryTypeAmount: body.deliveryTypeAmount,
        freeDeliveryAmount: body.freeDeliveryAmount,
        loyaltyPointsAmount: body.loyaltyPointsAmount,
        loyaltyPointsUnique: body.loyaltyPointsUnique,
        partnerId: body.partnerId || null,
      },
    });

    return NextResponse.json(
      {
        message: "Settings created successfully",
        settings: newSettings,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating Settings:", error);
    return NextResponse.json(
      { error: "Failed to create Settings" },
      { status: 500 },
    );
  }
}
