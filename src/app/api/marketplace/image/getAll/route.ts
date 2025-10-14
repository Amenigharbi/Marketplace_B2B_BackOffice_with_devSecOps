// app/api/images/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all images with related Product
export async function GET(req: Request) {
  try {
    const session = await auth(); // Get user session

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const images = await prisma.image.findMany();

    if (images.length === 0) {
      return NextResponse.json(
        { message: "No images found", images: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Images retrieved successfully", images },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to retrieve images" },
      { status: 500 },
    );
  }
}
