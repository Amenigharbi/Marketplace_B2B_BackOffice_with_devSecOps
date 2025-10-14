import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth"; // Import authentication service
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, partnerId } = body;

    // Vérification des données requises
    if (!customerId || !partnerId) {
      return NextResponse.json(
        { success: false, error: "customerId and partnerId are required" },
        { status: 400 },
      );
    }

    // Création du favori
    const favoritePartner = await prisma.favoritePartner.create({
      data: {
        customerId,
        partnerId,
      },
    });

    // Réponse standardisée
    return NextResponse.json(
      {
        success: true,
        favoritePartner: {
          id: favoritePartner.id,
          _id: favoritePartner.id,
          customerId: favoritePartner.customerId,
          partnerId: favoritePartner.partnerId,
          createdAt: favoritePartner.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating favorite partner:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
