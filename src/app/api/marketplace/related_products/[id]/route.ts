import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

// Configuration de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase configuration is missing");
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

// Fonction pour convertir les URLs d'images locales en URLs Supabase
function convertToSupabaseUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  // Si l'image est déjà une URL Supabase ou externe, la retourner telle quelle
  if (imagePath.includes("supabase.co") || imagePath.startsWith("http")) {
    return imagePath;
  }

  // Si c'est un chemin local, le convertir en URL Supabase
  if (imagePath.startsWith("/uploads/")) {
    const fileName = imagePath.split("/").pop();
    const { data: urlData } = supabase.storage
      .from("marketplace")
      .getPublicUrl(`products/${fileName}`);

    return urlData.publicUrl;
  }

  // Pour les autres cas (chemins relatifs), retourner le chemin tel quel
  return imagePath;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const relatedProducts = await prisma.relatedProduct.findMany({
      where: { productId: id },
      include: {
        product: {
          include: {
            images: true,
            skuPartners: {
              include: {
                partner: true,
              },
            },
          },
        },
        relatedProduct: {
          include: {
            images: true,
            skuPartners: {
              include: {
                partner: true,
              },
            },
          },
        },
      },
    });

    if (!relatedProducts || relatedProducts.length === 0) {
      return NextResponse.json(
        { message: "No related products found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Formatage des données avec conversion des URLs d'images
    const formatted = relatedProducts.map((rel) => {
      // Convertir les images du produit principal
      const productImageUrls = rel.product.images.map((img) =>
        convertToSupabaseUrl(img.url),
      );
      const productMainImage = rel.product.image
        ? convertToSupabaseUrl(rel.product.image)
        : null;

      // Convertir les images du produit associé
      const relatedProductImageUrls = rel.relatedProduct.images.map((img) =>
        convertToSupabaseUrl(img.url),
      );
      const relatedProductMainImage = rel.relatedProduct.image
        ? convertToSupabaseUrl(rel.relatedProduct.image)
        : null;

      // Convertir les logos des partenaires
      const productPartners = rel.product.skuPartners.map((sp) => ({
        id: sp.partner.id,
        username: sp.partner.username,
        logo: convertToSupabaseUrl(sp.partner.logo),
      }));

      const relatedProductPartners = rel.relatedProduct.skuPartners.map(
        (sp) => ({
          id: sp.partner.id,
          username: sp.partner.username,
          logo: convertToSupabaseUrl(sp.partner.logo),
        }),
      );

      return {
        id: rel.id,
        productId: rel.productId,
        relatedProductId: rel.relatedProductId,
        product: {
          ...rel.product,
          img: productMainImage,
          images: rel.product.images.map((img, index) => ({
            ...img,
            url: productImageUrls[index],
          })),
          imageUrls: productImageUrls,
          partners: productPartners,
        },
        relatedProduct: {
          ...rel.relatedProduct,
          img: relatedProductMainImage,
          images: rel.relatedProduct.images.map((img, index) => ({
            ...img,
            url: relatedProductImageUrls[index],
          })),
          imageUrls: relatedProductImageUrls,
          partners: relatedProductPartners,
        },
      };
    });

    return NextResponse.json(
      {
        message: "Related products retrieved",
        relatedProducts: formatted,
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to retrieve related products" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// 🟡 PATCH: Update a related product by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;
    const body = await req.json();

    const updatedRelatedProduct = await prisma.relatedProduct.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "Related product updated",
        relatedProduct: updatedRelatedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating related product:", error);
    return NextResponse.json(
      { error: "Failed to update related product" },
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

// 🔴 DELETE: Remove a related product by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    await prisma.relatedProduct.delete({ where: { id } });

    return NextResponse.json(
      { message: "Related product deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting related product:", error);
    return NextResponse.json(
      { error: "Failed to delete related product" },
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
