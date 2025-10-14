import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFiles = formData.getAll("images") as File[];
    const productId = formData.get("productId") as string | null;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    if (!imageFiles.length) {
      return NextResponse.json(
        { error: "At least one image file is required" },
        { status: 400 },
      );
    }

    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    let imageUrls: string[] = [];
    const newImages = [];

    for (const imageFile of imageFiles) {
      if (!validMimeTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Invalid image file type" },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(uploadPath, buffer);
      const imageUrl = `/uploads/${fileName}`;

      // Save image URL in the database
      const newImage = await prisma.image.create({
        data: {
          url: imageUrl,
          productId: productId,
        },
      });

      imageUrls.push(newImage.url);
      newImages.push(newImage);
    }

    return NextResponse.json(
      { message: "Images uploaded successfully", images: imageUrls },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 },
    );
  }
}
