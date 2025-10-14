import { NextResponse } from "next/server";

export const internalServerErrorResponse = (details?: string) =>
  NextResponse.json(
    {
      error: "An unexpected error occurred while processing the request.",
      details,
    },
    {
      status: 500,
    },
  );
