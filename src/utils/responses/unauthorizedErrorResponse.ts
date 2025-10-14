import { NextResponse } from "next/server";

export const unauthorizedErrorResponse = () =>
  NextResponse.json(
    {
      error: "Unauthorized",
      message: "API key is missing or invalid.",
    },
    {
      status: 401,
    },
  );
