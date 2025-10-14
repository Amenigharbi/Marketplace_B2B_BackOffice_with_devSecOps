export const revalidate = 0;

//import { getCollectionDocuments } from "@/clients/typesense/getCollectionDocuments";
//import { gmvPreviousDaysCollectionSchema } from "@/clients/typesense/schemas/GMVPreviousDaysCollection";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // const collectionName = gmvPreviousDaysCollectionSchema.name;
    // const result = await getCollectionDocuments(
    //   collectionName,
    //   "",
    //   "year,month",
    // );
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to display GMV previous days data" },
      { status: 500 },
    );
  }
}
