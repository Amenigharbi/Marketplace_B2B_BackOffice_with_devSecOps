import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/libs/supabaseClient";

const prisma = new PrismaClient();

// POST: Create a new banner
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const imageFile = formData.get("image") as File | null;
    const altText = formData.get("altText") as string | null;
    const description = formData.get("description") as string | null;
    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 },
      );
    }

    // Validate image type
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validImageTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 },
      );
    }

    // Upload to Supabase Storage
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const fileName = `banner-${Date.now()}-${imageFile.name.replace(
      /\s+/g,
      "-",
    )}`;
    const { data, error } = await supabase.storage
      .from("banners")
      .upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("banners")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Create the banner in the database
    const newBanner = await prisma.banner.create({
      data: {
        url: imageUrl,
        altText: altText || null,
        description: description || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Banner created successfully", banner: newBanner },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 },
    );
  }
}
