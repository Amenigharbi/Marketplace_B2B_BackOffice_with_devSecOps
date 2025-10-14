import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.roleId || !data.permissionId || !Array.isArray(data.actions)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Your existing creation logic
    const result = await prisma.rolePermission.create({
      data: {
        roleId: data.roleId,
        permissionId: data.permissionId,
        actions: data.actions,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Create role permission error:", error);
    return NextResponse.json(
      { error: "Failed to create role permission" },
      { status: 500 },
    );
  }
}
