import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");

  if (!supplierId) {
    return NextResponse.json(
      { error: "Paramètre supplierId manquant" },
      { status: 400 },
    );
  }

  try {
    const supplierIdString = supplierId.toString();

    const products = await prisma.product.findMany({
      where: {
        manufacturer: supplierIdString,
      },
      include: {
        stock_item: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[API] Erreur:", error);
    return NextResponse.json(
      { error: "Échec de la récupération", details: String(error) },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
