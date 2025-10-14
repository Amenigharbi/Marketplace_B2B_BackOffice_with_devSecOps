import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const MAGENTO_API_URL =
  "https://uat.kamioun.com/rest/default/V1/store/storeViews?fields=id,code,website_id,name";
const MAGENTO_BEARER_TOKEN = "pd2as4cqycmj671bga4egknw2csoa9b6";

export async function GET() {
  try {
    const response = await fetch(MAGENTO_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAGENTO_BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur API Magento:", errorData);
      return NextResponse.json(
        {
          error: `Erreur API Magento: ${response.statusText}`,
          details: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    const storeViews = data;

    if (!storeViews || storeViews.length === 0) {
      return NextResponse.json(
        { message: "Aucun warehouse trouvé" },
        { status: 404 },
      );
    }
    for (let storeView of storeViews) {
      if (storeView.id === 0 || storeView.id === 1) {
        continue;
      }

      const insertedWarehouse = await prisma.warehouse.upsert({
        where: { warehouseId: storeView.id },
        update: {},
        create: {
          warehouseId: storeView.id,
          websiteId: storeView.website_id,
          name: storeView.name,
          code: storeView.code,
        },
      });
    }

    return NextResponse.json(
      { message: "warehouses synchronisées " },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des warehouses:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
