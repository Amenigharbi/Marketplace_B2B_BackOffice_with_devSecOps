import { NextResponse } from "next/server";

export const invalidRequestErrorResponse = (details?: string) => {
  return NextResponse.json(
    {
      error: "Invalid request.",
      details,
    },
    {
      status: 400,
    },
  );
};
