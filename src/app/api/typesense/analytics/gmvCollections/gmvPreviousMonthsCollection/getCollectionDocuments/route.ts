export const revalidate = 0;

import { getCollectionDocuments } from "@/clients/typesense/getCollectionDocuments";
import { gmvPreviousMonthsCollectionSchema } from "@/clients/typesense/schemas/gmvPreviousMonthsCollection";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const collectionName = gmvPreviousMonthsCollectionSchema.name;
    const result = await getCollectionDocuments(
      collectionName,
      "",
      "year,month",
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to display GMV previous months data" },
      { status: 500 },
    );
  }
}
