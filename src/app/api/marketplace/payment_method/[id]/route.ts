import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a payment method by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // let user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // // Get user's role
    // const userRole = await prisma.role.findUnique({
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
    //       rp.permission?.resource === "Payment Method" &&
    //       rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return NextResponse.json(
    //       {
    //         message: "Forbidden: missing 'read' permission for Payment Method",
    //       },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    const paymentMethod = await prisma.orderPayment.findUnique({
      where: { id },
      include: {
        orders: true,
        reservations: true,
      },
    });

    if (!paymentMethod) {
      return NextResponse.json(
        { message: "Payment method not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Payment method retrieved successfully", paymentMethod },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching payment method:", error);
    return NextResponse.json(
      { error: "Failed to retrieve payment method" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update a payment method by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
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

      const canUpdate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Payment Method" &&
          rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          {
            message:
              "Forbidden: missing 'update' permission for Payment Method",
          },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check for existing payment method with same name
    const existingPayment = await prisma.orderPayment.findFirst({
      where: {
        name: body.name,
        id: { not: id }, // Exclude current payment method
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment method with this name already exists" },
        { status: 409 },
      );
    }

    const { id: _, ...dataToUpdate } = body;

    const updatedPaymentMethod = await prisma.orderPayment.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(
      {
        message: "Payment method updated successfully",
        paymentMethod: updatedPaymentMethod,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove a payment method by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

      const canDelete = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Payment Method" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          {
            message:
              "Forbidden: missing 'delete' permission for Payment Method",
          },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    // Check if payment method exists
    const paymentMethod = await prisma.orderPayment.findUnique({
      where: { id },
      include: {
        orders: true,
        reservations: true,
      },
    });

    if (!paymentMethod) {
      return NextResponse.json(
        { message: "Payment method not found" },
        { status: 404 },
      );
    }

    // Check if payment method is in use
    if (
      paymentMethod.orders.length > 0 ||
      paymentMethod.reservations.length > 0
    ) {
      return NextResponse.json(
        { error: "Cannot delete payment method that is in use" },
        { status: 400 },
      );
    }

    await prisma.orderPayment.delete({ where: { id } });

    return NextResponse.json(
      { message: "Payment method deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      { error: "Failed to delete payment method" },
      { status: 500 },
    );
  }
}
