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

// 🟢 GET: Récupérer une marque par ID avec ses produits
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Vérifier que l'ID est valide
    if (!params.id) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Récupérer la marque et tous ses produits sans pagination
    const brandWithProducts = await prisma.brand.findUnique({
      where: { id: params.id },
      include: {
        products: {
          orderBy: { createdAt: "desc" },
          include: {
            images: true,
            brand: true,
            supplier: true,
            skuPartners: {
              include: {
                partner: true,
              },
            },
          },
        },
      },
    });

    if (!brandWithProducts) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Si l'image de la marque est stockée localement, convertir l'URL en URL Supabase
    let brandWithUpdatedImages = { ...brandWithProducts };

    if (
      brandWithProducts.img &&
      brandWithProducts.img.startsWith("/uploads/brands")
    ) {
      // Générer l'URL Supabase équivalente
      const fileName = brandWithProducts.img.split("/").pop();
      const { data: urlData } = supabase.storage
        .from("marketplace")
        .getPublicUrl(`brands/${fileName}`);

      brandWithUpdatedImages = {
        ...brandWithProducts,
        img: urlData.publicUrl,
      };
    }

    return NextResponse.json(
      {
        success: true,
        brand: brandWithUpdatedImages,
        message: "Brand products retrieved successfully",
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error fetching brand products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch brand products",
        data: null,
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

// 🟡 PATCH: Mettre à jour une marque par ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const name = formData.get("name") as string | null;

    // Récupérer la marque existante
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Préparer les données de mise à jour
    const updateData: { img?: string; name?: string | null } = {};

    // Mettre à jour le nom si fourni
    if (name !== null) {
      updateData.name = name;
    }

    // Gérer la mise à jour de l'image si fournie
    if (imageFile) {
      // Convertir le fichier en Buffer
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // Générer un nom de fichier unique
      const fileName = `brand-${Date.now()}-${imageFile.name.replace(
        /\s+/g,
        "-",
      )}`;
      const filePath = `brands/${fileName}`;

      // Télécharger l'image vers Supabase Storage
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
          { status: 500, headers: corsHeaders },
        );
      }

      // Obtenir l'URL publique de l'image téléchargée
      const { data: urlData } = supabase.storage
        .from("marketplace")
        .getPublicUrl(filePath);

      updateData.img = urlData.publicUrl;

      // Supprimer l'ancienne image de Supabase si elle existe
      if (existingBrand.img) {
        try {
          // Extraire le chemin du fichier de l'URL
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
              // Continuer même si la suppression échoue
            }
          }
        } catch (error) {
          console.error("Error parsing old image URL:", error);
          // Continuer même si l'analyse échoue
        }
      }
    }

    // Mettre à jour la marque dans la base de données
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Brand updated successfully",
        brand: updatedBrand,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update brand",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

// 🔴 DELETE: Supprimer une marque et son image de Supabase
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Récupérer la marque à supprimer
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Supprimer l'image de Supabase Storage si elle existe
    if (brand.img) {
      try {
        // Extraire le chemin du fichier de l'URL
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
            // Continuer même si la suppression échoue
          }
        }
      } catch (error) {
        console.error("Error parsing image URL:", error);
        // Continuer même si l'analyse échoue
      }
    }

    // Supprimer la marque de la base de données
    await prisma.brand.delete({ where: { id } });

    return NextResponse.json(
      {
        success: true,
        message: "Brand deleted successfully",
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete brand",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
