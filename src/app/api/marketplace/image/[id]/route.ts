// app/api/images/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve a single image by ID with related Product
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Image retrieved successfully", image },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to retrieve image" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update an image by ID
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

    // Update the image by ID
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        url: body.url,
        altText: body.altText ?? null, // Alt text is optional
        productId: body.productId,
      },
    });

    return NextResponse.json(
      { message: "Image updated successfully", image: updatedImage },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove an image by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Delete the image by ID
    await prisma.image.delete({ where: { id } });

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
