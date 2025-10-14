// app/api/states/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all states
export async function GET(req: Request) {
  try {
    const states = await prisma.state.findMany({
      include: {
        statuses: true,
      },
    }); // Retrieve all states

    if (states.length === 0) {
      return NextResponse.json(
        { message: "No states found", states: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "States retrieved successfully", states },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching states:", error);
    return NextResponse.json(
      { error: "Failed to retrieve states" },
      { status: 500 },
    );
  }
}
