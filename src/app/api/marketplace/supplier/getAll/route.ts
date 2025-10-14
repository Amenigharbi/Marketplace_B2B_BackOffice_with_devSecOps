// app/api/manufacturers/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

// Handler for OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Handler for GET requests
export async function GET(req: Request) {
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

    // if (!user.mRoleId) {
    //   return NextResponse.json({ message: "No role found" }, { status: 403 });
    // }

    // // Get user's role to check if they're KamiounAdminMaster
    // const userRole = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    // });

    // // Check if user is KamiounAdminMaster or has required permission
    // if (userRole?.name !== "KamiounAdminMaster") {
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

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const search = url.searchParams.get("search") || "";

    // Validate parameters
    if (page < 1 || limit < 1) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid pagination parameters" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const skip = (page - 1) * limit;

    const [manufacturers, totalManufacturers] = await Promise.all([
      prisma.manufacturer.findMany({
        skip,
        take: limit,
        where: {
          OR: [
            { code: { contains: search, mode: "insensitive" } },
            { companyName: { contains: search, mode: "insensitive" } },
            { contactName: { contains: search, mode: "insensitive" } },
            { phoneNumber: { contains: search, mode: "insensitive" } },
            { postalCode: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { country: { contains: search, mode: "insensitive" } },
            { capital: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        },
        include: {
          supplierCategories: {
            include: {
              category: true,
            },
          },
          products: {
            include: {
              images: true,
              productType: true,
              productStatus: true,
            },
          },
        },
      }),
      // Total count for pagination
      prisma.manufacturer.count({
        where: {
          OR: [
            { code: { contains: search, mode: "insensitive" } },
            { companyName: { contains: search, mode: "insensitive" } },
            { contactName: { contains: search, mode: "insensitive" } },
            { phoneNumber: { contains: search, mode: "insensitive" } },
            { postalCode: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { country: { contains: search, mode: "insensitive" } },
            { capital: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    // Format response
    const responseData = {
      success: true,
      message:
        manufacturers.length === 0
          ? "No manufacturers found"
          : "Manufacturers retrieved successfully",
      data: manufacturers.map((manufacturer) => ({
        ...manufacturer,
        supplierCategories: manufacturer.supplierCategories.map(
          (supplierCategory) => ({
            ...supplierCategory,
            categoryName: supplierCategory.category.nameCategory,
          }),
        ),
        productsCount: manufacturer.products.length,
        assignedProducts: manufacturer.products.map((product) => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
        })),
      })),
      meta: {
        total: totalManufacturers,
        currentPage: page,
        totalPages: Math.ceil(totalManufacturers / limit),
        limit,
      },
    };

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    // Error handling
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching manufacturers:", errorMessage);

    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Failed to retrieve manufacturers",
        message: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
}
