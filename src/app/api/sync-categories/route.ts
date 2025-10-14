import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const MAGENTO_API_URL =
  "https://uat.kamioun.com/rest/default/V1/categories?fields=children_data[id,name]";
const MAGENTO_BEARER_TOKEN = "pd2as4cqycmj671bga4egknw2csoa9b6";

export async function GET() {
  try {
    // Récupérer les catégories depuis l'API Magento avec le Bearer Token
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
    const categories = data.children_data;

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { message: "Aucune catégorie trouvée" },
        { status: 404 },
      );
    }

    // Transformer et insérer les données dans MongoDB
    try {
      const insertedCategories = await prisma.category.createMany({
        data: categories.map((cat: { id: number; name: string }) => ({
          categoryId: cat.id,
          nameCategory: cat.name,
        })),
      });

      return NextResponse.json(
        {
          message: "Catégories synchronisées ✅",
          insertedCategories: insertedCategories,
          count: insertedCategories.count,
        },
        { status: 200 },
      );
    } catch (dbError: unknown) {
      if (dbError instanceof Error) {
        console.error(
          "Erreur lors de l'insertion dans MongoDB:",
          dbError.message,
        );
        return NextResponse.json(
          {
            error: "Erreur lors de l'insertion dans MongoDB",
            details: dbError.message,
          },
          { status: 500 },
        );
      } else {
        console.error("Erreur inconnue lors de l'insertion dans MongoDB");
        return NextResponse.json(
          { error: "Erreur inconnue lors de l'insertion dans MongoDB" },
          { status: 500 },
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
