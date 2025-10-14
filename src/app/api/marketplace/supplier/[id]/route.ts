// app/api/manufacturers/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { corsHeaders } from "@/utils/cors";
const prisma = new PrismaClient();
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
// GET: Retrieve a single manufacturer by ID
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

    // // Check if user is KamiounAdminMaster
    // const isAdmin = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    //   select: { name: true },
    // });

    // if (isAdmin?.name !== "KamiounAdminMaster") {
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
    //       rp.permission?.resource === "Supplier" && rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'read' permission for Supplier" },
    //       { status: 403 },
    //     );
    //   }
    // }
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            images: true,
            productType: true,
            productStatus: true,
          },
        },
      },
    });

    if (!manufacturer) {
      return NextResponse.json(
        { message: "Manufacturer not found" },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    return NextResponse.json(
      { message: "Manufacturer retrieved successfully", manufacturer },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error fetching manufacturer:", error);
    return NextResponse.json(
      { error: "Failed to retrieve manufacturer" },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}

// PATCH: Update a manufacturer's details
export async function PATCH(
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

    // // Check if user is KamiounAdminMaster
    // const isAdmin = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    //   select: { name: true },
    // });

    // if (isAdmin?.name !== "KamiounAdminMaster") {
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
    //       rp.permission?.resource === "Supplier" &&
    //       rp.actions.includes("update"),
    //   );

    //   if (!canUpdate) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'update' permission for Supplier" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    const body = await req.json();

    const updatedManufacturer = await prisma.$transaction(async (prisma) => {
      const manufacturer = await prisma.manufacturer.update({
        where: { id },
        data: {
          manufacturerId: body.manufacturerId,
          code: body.code,
          companyName: body.companyName,
          contactName: body.contactName,
          phoneNumber: body.phoneNumber,
          postalCode: body.postalCode,
          city: body.city,
          country: body.country,
          capital: body.capital,
          email: body.email,
          address: body.address,
        },
      });

      // Handle product assignments
      if (body.selectedProductIds) {
        // First, remove all current product assignments for this manufacturer
        await prisma.product.updateMany({
          where: { supplierId: id },
          data: { supplierId: null },
        });

        // Then assign the selected products to this manufacturer
        if (body.selectedProductIds.length > 0) {
          await prisma.product.updateMany({
            where: { id: { in: body.selectedProductIds } },
            data: { supplierId: id },
          });
        }
      }

      // Handle categories (keeping existing logic for backward compatibility)
      if (body.categories) {
        await prisma.supplierCategory.deleteMany({
          where: { supplierId: id },
        });

        if (body.categories.length > 0) {
          await prisma.supplierCategory.createMany({
            data: body.categories.map((categoryId: string) => ({
              supplierId: id,
              categoryId,
            })),
          });
        }
      }

      return prisma.manufacturer.findUnique({
        where: { id },
        include: {
          supplierCategories: {
            include: {
              category: true,
            },
          },
          products: true,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Manufacturer updated successfully",
        manufacturer: updatedManufacturer,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating manufacturer:", error);
    return NextResponse.json(
      {
        error: "Failed to update manufacturer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// DELETE: Remove a manufacturer by ID
export async function DELETE(
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

    // // Check if user is KamiounAdminMaster
    // const isAdmin = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    //   select: { name: true },
    // });

    // if (isAdmin?.name !== "KamiounAdminMaster") {
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
    //       rp.permission?.resource === "Supplier" &&
    //       rp.actions.includes("delete"),
    //   );

    //   if (!canDelete) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'delete' permission for Supplier" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;

    await prisma.manufacturer.delete({ where: { id } });

    return NextResponse.json(
      { message: "Manufacturer deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting manufacturer:", error);
    return NextResponse.json(
      { error: "Failed to delete manufacturer" },
      { status: 500 },
    );
  }
}
