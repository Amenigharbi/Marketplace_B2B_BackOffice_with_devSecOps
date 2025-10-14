// app/api/promotions/create/route.ts
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
          rp.permission?.resource === "Promotion" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for Promotion" },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.promotion.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Promotion",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Promotion",
          },
        });
      }
    }

    const newPromotion = await prisma.promotion.create({
      data: {
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        promoPrice: body.promoPrice,
      },
    });

    return NextResponse.json(
      { message: "Promotion created successfully", promotion: newPromotion },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 },
    );
  }
}
