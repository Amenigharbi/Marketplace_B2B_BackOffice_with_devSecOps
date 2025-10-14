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

export async function GET(req: Request) {
  try {
    // Optional: Uncomment to enable authentication
    // const session = await auth();
    // if (!session?.user) {
    //   return new NextResponse(
    //     JSON.stringify({ message: "Unauthorized" }),
    //     {
    //       status: 401,
    //       headers: {
    //         'Content-Type': 'application/json',
    //         ...corsHeaders,
    //       },
    //     }
    //   );
    // }

    // Fetch all product subcategories with product and subcategory data
    const productSubCategories = await prisma.productSubCategory.findMany({
      select: {
        id: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            category: {
              select: {
                id: true,
                nameCategory: true,
              },
            },
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Product subcategories retrieved successfully",
        productSubCategories,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching product subcategories:", errorMessage);

    return new NextResponse(
      JSON.stringify({
        error: "Failed to retrieve product subcategories",
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
