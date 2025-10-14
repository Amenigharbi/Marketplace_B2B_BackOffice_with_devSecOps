import { responses } from "@/utils/responses";
import { checkApiKey } from "@/services/auth/checkApiKey";
import { NextResponse, type NextRequest } from "next/server";
import { startIndexingStream } from "@/services/typesense/populateOrdersCollection/startIndexingStream";

export async function POST(request: NextRequest) {
  const isAuthorized = await checkApiKey(request);

  if (!isAuthorized) {
    return responses.unauthorized();
  }
  startIndexingStream();
  return NextResponse.json("Orders Populating ...", { status: 202 });
}
