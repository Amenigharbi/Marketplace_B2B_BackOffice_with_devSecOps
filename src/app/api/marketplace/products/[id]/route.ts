import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { corsHeaders } from "@/utils/cors";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

// Configuration de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("Supabase configuration is missing");
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: corsHeaders,
    },
  );
}

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

  return imagePath;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        productType: true,
        productStatus: true,
        supplier: true,
        tax: true,
        promotion: true,
        images: true,
        productSubCategories: {
          where: {
            subcategory: {
              category: {
                id: { not: undefined },
              },
            },
          },
          include: {
            subcategory: {
              include: {
                category: true,
              },
            },
          },
        },
        favoriteProducts: true,
        relatedProducts: {
          where: {
            relatedProduct: {
              id: { not: undefined },
            },
          },
          include: {
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
        },
        skuPartners: {
          include: {
            partner: true,
            stock: {
              include: {
                source: true,
              },
            },
          },
        },
        brand: true, // Ajouter l'inclusion de la marque
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
          message: "Product not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }

    // Convertir les URLs d'images locales en URLs Supabase
    const productWithSupabaseUrls = {
      ...product,
      image: convertToSupabaseUrl(product.image), // CORRECTION: utiliser 'image' au lieu de 'img'
      images: product.images.map((image) => ({
        ...image,
        url: convertToSupabaseUrl(image.url),
      })),
      // Convertir les URLs des produits liés
      relatedProducts: product.relatedProducts.map((rp) => {
        const relatedProduct = rp.relatedProduct;
        return {
          ...rp,
          relatedProduct: {
            ...relatedProduct,
            image: convertToSupabaseUrl(relatedProduct.image), // CORRECTION: utiliser 'image'
            images: relatedProduct.images.map((image) => ({
              ...image,
              url: convertToSupabaseUrl(image.url),
            })),
          },
        };
      }),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Product retrieved successfully",
        data: productWithSupabaseUrls,
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching product:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve product",
        message: errorMessage,
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
