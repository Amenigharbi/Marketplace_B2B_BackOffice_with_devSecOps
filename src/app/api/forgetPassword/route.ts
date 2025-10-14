import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  const { email } = await request.json();
  const responseMessage =
    "If this account exists, a reset link will be sent to your email";

  try {
    // Validation des entrées
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Recherche de l'utilisateur
    const user = await prisma.customers.findFirst({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: responseMessage },
        { status: 200, headers: corsHeaders },
      );
    }

    // Nettoyage des tokens existants
    await prisma.passwordResetToken.deleteMany({
      where: { customerId: user.id },
    });

    // Création du nouveau token
    const publicId = crypto.randomBytes(16).toString("hex");
    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        token,
        publicId,
        customerId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // 1 heure
      },
    });

    return NextResponse.json(
      {
        message: responseMessage,
        resetData: { publicId, email: user.email },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { message: "Une erreur inattendue s'est produite. Veuillez réessayer." },
      { status: 500, headers: corsHeaders },
    );
  }
}
