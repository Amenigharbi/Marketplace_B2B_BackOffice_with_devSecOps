import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validation simple
    if (!body.name || !body.stateId) {
      return NextResponse.json(
        { error: "Name and stateId are required" },
        { status: 400 },
      );
    }

    const newStatus = await prisma.status.create({
      data: {
        name: body.name,
        stateId: body.stateId,
      },
    });

    return NextResponse.json(newStatus, { status: 201 });
  } catch (error: any) {
    console.error("Error creating status:", error);

    // Gestion spécifique des erreurs Prisma
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Status name already exists",
          code: error.code,
          meta: error.meta,
        },
        { status: 409 }, // Conflict
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to create status",
        code: error.code,
      },
      { status: 500 },
    );
  }
}
