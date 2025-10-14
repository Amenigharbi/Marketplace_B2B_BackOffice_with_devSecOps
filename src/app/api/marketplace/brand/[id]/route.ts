// app/api/marketplace/brand/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";
import { supabase } from "@/libs/supabaseClient";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// 🟢 GET: Retrieve a single brand by ID with related Product
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const url = new URL(req.url);
    const includeProducts = url.searchParams.get("includeProducts") === "true";

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: includeProducts
        ? {
            products: {
              include: {
                images: true,
                skuPartners: {
                  include: {
                    partner: true,
                  },
                },
              },
              take: 10, // Limite par défaut
            },
          }
        : {},
    });

    if (!brand) {
      return NextResponse.json(
        { message: "Brand not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    return NextResponse.json(
      { message: "Brand retrieved successfully", brand },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Failed to retrieve brand" },
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

// 🟡 PATCH: Update a brand by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;

    // Get existing brand
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: { img?: string; name?: string | null } = {};

    // Update name if provided
    if (name !== null) {
      updateData.name = name;
    }

    // Handle image update if provided
    if (imageFile) {
      // Convert File to Buffer
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // Generate unique filename
      const fileName = `brand-${Date.now()}-${imageFile.name.replace(
        /\s+/g,
        "-",
      )}`;
      const filePath = `brands/${fileName}`;

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("marketplace")
        .upload(filePath, buffer, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading image to Supabase:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 },
        );
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from("marketplace")
        .getPublicUrl(filePath);

      updateData.img = urlData.publicUrl;

      // Delete old image from Supabase if it exists and is from the same bucket
      if (existingBrand.img) {
        try {
          // Extract file path from URL if it's a Supabase URL
          const oldUrl = new URL(existingBrand.img);
          const oldFilePath = oldUrl.pathname.split(
            "/storage/v1/object/public/marketplace/",
          )[1];

          if (oldFilePath) {
            const { error: deleteError } = await supabase.storage
              .from("marketplace")
              .remove([oldFilePath]);

            if (deleteError) {
              console.error(
                "Error deleting old image from Supabase:",
                deleteError,
              );
              // Continue with update even if deleting old file fails
            }
          }
        } catch (error) {
          console.error("Error parsing old image URL:", error);
          // Continue with update even if parsing fails
        }
      }
    }

    // Update the brand
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Brand updated successfully", brand: updatedBrand },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}

// 🔴 DELETE: Remove a brand by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth(); // Get user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    // Get the brand to delete (so we can delete the image file)
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Delete the image from Supabase Storage if it exists and is from the marketplace bucket
    if (brand.img) {
      try {
        // Extract file path from URL if it's a Supabase URL
        const url = new URL(brand.img);
        const filePath = url.pathname.split(
          "/storage/v1/object/public/marketplace/",
        )[1];

        if (filePath) {
          const { error: deleteError } = await supabase.storage
            .from("marketplace")
            .remove([filePath]);

          if (deleteError) {
            console.error("Error deleting image from Supabase:", deleteError);
            // Continue with deletion even if file deletion fails
          }
        }
      } catch (error) {
        console.error("Error parsing image URL:", error);
        // Continue with deletion even if parsing fails
      }
    }

    // Delete the brand from database
    await prisma.brand.delete({ where: { id } });

    return NextResponse.json(
      { message: "Brand deleted successfully" },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
