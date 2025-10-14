import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany();
    return NextResponse.json(
      warehouses.map((w: { name: any; warehouseId: any }) => ({
        name: w.name,
        warehouseId: w.warehouseId,
      })),
    );
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
