export const revalidate = 0;

import { getCollectionDocuments } from "@/clients/typesense/getCollectionDocuments";
import { nucPreviousMonthsCollectionSchema } from "@/clients/typesense/schemas/nucPreviousMonthsCollection";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const collectionName = nucPreviousMonthsCollectionSchema.name;
    const result = await getCollectionDocuments(collectionName);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to display Nuc previous days data" },
      { status: 500 },
    );
  }
}
