import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import * as path from "path";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import { writeFile } from "fs/promises";
import { corsHeaders } from "@/utils/cors";
import { supabase } from "@/libs/supabaseClient";

const prisma = new PrismaClient();

// GET: Retrieve a banner by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { message: "Banner retrieved successfully", banner },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to retrieve banner" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PATCH: Update a banner by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const altText = formData.get("altText") as string | null;
    const description = formData.get("description") as string | null;

    const existingBanner = await prisma.banner.findUnique({ where: { id } });
    if (!existingBanner) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 },
      );
    }

    const updateData: {
      url?: string;
      altText?: string | null;
      description?: string | null;
    } = {};

    if (altText !== null) {
      updateData.altText = altText;
    }
    if (description !== null) {
      updateData.description = description;
    }

    if (imageFile) {
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

      updateData.url = publicUrlData.publicUrl;
    }

    if (existingBanner.url) {
      const urlParts = existingBanner.url.split("/");
      const oldFileName = urlParts[urlParts.length - 1];
      if (oldFileName) {
        const { error } = await supabase.storage
          .from("banners")
          .remove([oldFileName]);
        if (error && !error.message.includes("Object not found")) {
          console.error(
            "Error deleting old banner image from Supabase:",
            error,
          );
        }
      }
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Banner updated successfully", banner: updatedBanner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a banner by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Get the banner to delete
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 },
      );
    }

    if (banner.url) {
      const urlParts = banner.url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      if (fileName) {
        const { error } = await supabase.storage
          .from("banners")
          .remove([fileName]);
        if (error) {
          console.error("Error deleting banner image from Supabase:", error);
        }
      }
    }

    // Delete the banner from the database
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Banner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 },
    );
  }
}
