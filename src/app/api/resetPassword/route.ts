import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const { publicId, password } = await request.json();

    if (!publicId || !password) {
      return NextResponse.json(
        { error: "Public ID et mot de passe requis" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { publicId },
      include: { customer: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Lien invalide ou expiré" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { publicId } });
      return NextResponse.json(
        { error: "Le lien a expiré" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await prisma.customers.update({
      where: { id: resetToken.customerId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.deleteMany({
      where: { customerId: resetToken.customerId },
    });

    return NextResponse.json(
      {
        message: "Mot de passe mis à jour avec succès",
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          telephone: updatedUser.telephone,
          address: updatedUser.address,
          governorate: updatedUser.governorate,
          socialName: updatedUser.socialName,
          businessType: updatedUser.businessType,
          fiscalId: updatedUser.fiscalId,
          activity1: updatedUser.activity1,
          activity2: updatedUser.activity2,
          cinPhoto: updatedUser.cinPhoto,
          patentPhoto: updatedUser.patentPhoto,
          createdAt: updatedUser.created_at,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
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
