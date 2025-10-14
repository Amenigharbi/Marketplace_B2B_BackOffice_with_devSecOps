import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase configuration is missing");
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

  return imagePath;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get("partnerId");
    const searchTerm = searchParams.get("search");
    const whereClause = {
      accepted: true,
      ...(partnerId
        ? {
            skuPartners: {
              some: {
                partnerId: partnerId,
              },
            },
          }
        : {}),
      ...(searchTerm
        ? {
            OR: [{ name: { contains: searchTerm, mode: "insensitive" } }],
          }
        : {}),
    };

    const products = await prisma.product.findMany({
      where: whereClause as any,
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
      },
    });

    // Convertir les URLs d'images locales en URLs Supabase
    const productsWithSupabaseUrls = products.map((product) => {
      // CORRECTION : Utiliser product.image au lieu de product.img
      const mainImage = product.image
        ? convertToSupabaseUrl(product.image)
        : null;

      // Convertir les URLs des images supplémentaires
      const images = product.images.map((image) => ({
        ...image,
        url: convertToSupabaseUrl(image.url),
      }));

      // Convertir les URLs des produits liés
      const relatedProducts = product.relatedProducts.map((rp) => {
        const relatedProduct = rp.relatedProduct;
        // CORRECTION : Utiliser relatedProduct.image au lieu de relatedProduct.img
        const relatedMainImage = relatedProduct.image
          ? convertToSupabaseUrl(relatedProduct.image)
          : null;

        const relatedImages = relatedProduct.images.map((image) => ({
          ...image,
          url: convertToSupabaseUrl(image.url),
        }));

        return {
          ...rp,
          relatedProduct: {
            ...relatedProduct,
            image: relatedMainImage, // Garder le nom original
            images: relatedImages,
          },
        };
      });

      return {
        ...product,
        image: mainImage, // Garder le nom original 'image'
        images,
        relatedProducts,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: productsWithSupabaseUrls.length
          ? "Products retrieved successfully"
          : "No products found",
        data: productsWithSupabaseUrls,
        meta: { count: productsWithSupabaseUrls.length },
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error fetching products:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve products",
        message: errorMessage,
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
