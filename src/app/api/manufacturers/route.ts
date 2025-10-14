import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET() {
  try {
    const manufacturers = await prisma.manufacturer.findMany();

    return NextResponse.json({
      success: true,
      data: manufacturers.map((m: any) => ({
        manufacturerId: m.manufacturerId,
        companyName: m.companyName,
        code: m.code,
        email: m.email,
        address: m.address,
        contactName: m.contactName,
        phoneNumber: m.phoneNumber,
        postalCode: m.postalCode,
        city: m.city,
        country: m.country,
        capital: m.capital,
      })),
      meta: {
        total: manufacturers.length,
      },
    });
  } catch (error) {
    console.error("Erreur API manufacturers:", error);
    return NextResponse.json(
      { success: false, error: "Échec de la récupération des fournisseurs" },
      { status: 500 },
    );
  }
}
