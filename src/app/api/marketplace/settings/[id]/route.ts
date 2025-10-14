// app/api/settings/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET specific setting
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    //   const canRead = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Settings" && rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'read' permission for Settings" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;

    const settings = await prisma.settings.findUnique({
      where: { id },
      include: {
        partner: true,
        schedules: true,
      },
    });

    if (!settings) {
      return NextResponse.json(
        { message: "Settings not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Settings retrieved successfully", settings },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching Settings:", error);
    return NextResponse.json(
      { error: "Failed to retrieve Settings" },
      { status: 500 },
    );
  }
}

// UPDATE setting
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    //   const canUpdate = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Settings" &&
    //       rp.actions.includes("update"),
    //   );

    //   if (!canUpdate) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'update' permission for Settings" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    const body = await req.json();

    const updatedSettings = await prisma.settings.update({
      where: { id },
      data: {
        deliveryType: body.deliveryType,
        deliveryTypeAmount: body.deliveryTypeAmount,
        freeDeliveryAmount: body.freeDeliveryAmount,
        loyaltyPointsAmount: body.loyaltyPointsAmount,
        loyaltyPointsUnique: body.loyaltyPointsUnique,
        partnerId: body.partnerId,
      },
    });

    return NextResponse.json(
      {
        message: "Settings updated successfully",
        settings: updatedSettings,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating Settings:", error);
    return NextResponse.json(
      { error: "Failed to update Settings" },
      { status: 500 },
    );
  }
}

// DELETE setting
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    //   const canDelete = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Settings" &&
    //       rp.actions.includes("delete"),
    //   );

    //   if (!canDelete) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'delete' permission for Settings" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;

    await prisma.settings.delete({ where: { id } });

    return NextResponse.json(
      { message: "Settings deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting Settings:", error);
    return NextResponse.json(
      { error: "Failed to delete Settings" },
      { status: 500 },
    );
  }
}
