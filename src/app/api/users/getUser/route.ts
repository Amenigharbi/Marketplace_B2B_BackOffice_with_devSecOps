export const revalidate = 0;

import { responses } from "@/utils/responses";
import { getUser } from "@/services/users/getUser";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const username = searchParams.get("username");
    if (!username) {
      return responses.invalidRequest("username parameter is Required");
    }

    const result = await getUser(username);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 },
    );
  }
};
