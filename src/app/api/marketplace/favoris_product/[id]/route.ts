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

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
    //     status: 401,
    //     headers: corsHeaders,
    //   });
    // }

    const { id } = params;

    const favoriteProduct = await prisma.favoriteProduct.findUnique({
      where: { id },
      include: {
        customer: true,
        product: true,
      },
    });

    if (!favoriteProduct) {
      return new NextResponse(
        JSON.stringify({ message: "Favorite product not found" }),
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Favorite product retrieved successfully",
        favoriteProduct,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Error fetching favorite product:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to retrieve favorite product" }),
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
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updatedFavoriteProduct = await prisma.favoriteProduct.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "Favorite product updated successfully",
        favoriteProduct: updatedFavoriteProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating favorite product:", error);
    return NextResponse.json(
      { error: "Failed to update favorite product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const favorite = await prisma.favoriteProduct.findUnique({
      where: { id },
    });

    if (!favorite) {
      return new NextResponse(
        JSON.stringify({ message: "Favorite not found" }),
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    await prisma.favoriteProduct.delete({ where: { id } });

    return new NextResponse(
      JSON.stringify({ message: "Favorite product deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Error deleting favorite product:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete favorite product" }),
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
