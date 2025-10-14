import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 POST: Create a new order payment method
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

    // Get user's role to check if they're KamiounAdminMaster
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
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
          rp.permission?.resource === "Payment Method" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          {
            message:
              "Forbidden: missing 'create' permission for Payment Method",
          },
          { status: 403 },
        );
      }
    }

    const body = await req.json();

    const existingData = await prisma.orderPayment.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Payment Method",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Payment Method",
          },
        });
      }
    }

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check for existing payment method with same name
    const existingPayment = await prisma.orderPayment.findFirst({
      where: { name: body.name },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment method with this name already exists" },
        { status: 409 },
      );
    }

    const newOrderPayment = await prisma.orderPayment.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      {
        message: "Payment method created successfully",
        orderPayment: newOrderPayment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating payment method:", error);
    return NextResponse.json(
      { error: "Failed to create payment method" },
      { status: 500 },
    );
  }
}
