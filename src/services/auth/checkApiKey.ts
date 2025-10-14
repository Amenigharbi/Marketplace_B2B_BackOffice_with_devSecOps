import { NextRequest } from "next/server";

export const checkApiKey = async (request: NextRequest): Promise<boolean> => {
  const forwarded: string = request.headers.get("x-forwarded-for") ?? "";
  const key: string = request.headers.get("x-api-key") ?? "";

  return key === "HgomyMjEBfIAi0FukmGf5E65sKDhEy";
};
