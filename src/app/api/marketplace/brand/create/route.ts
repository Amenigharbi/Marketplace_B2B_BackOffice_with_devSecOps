import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Brand image is required" },
        { status: 400 },
      );
    }

    // Create brands directory if it doesn't exist
    const brandsDir = path.join(process.cwd(), "public/uploads/brands");
    await fs.promises.mkdir(brandsDir, { recursive: true });

    // Save the image file
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const fileName = `brand-${Date.now()}-${imageFile.name}`;
    const uploadPath = path.join(brandsDir, fileName);

    await writeFile(uploadPath, buffer);
    const imageUrl = `/uploads/brands/${fileName}`;

    // Create the brand in database
    const brand = await prisma.brand.create({
      data: {
        img: imageUrl,
        name: name || null,
      },
    });

    return NextResponse.json(
      { message: "Brand created successfully", brand },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 },
    );
  }
}
