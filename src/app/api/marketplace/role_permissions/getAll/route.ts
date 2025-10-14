import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const all = await prisma.rolePermission.findMany({
      include: {
        role: true,
        permission: true,
      },
    });

    return NextResponse.json(
      { message: "Fetched all RolePermissions", rolePermissions: all },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching RolePermissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch RolePermissions" },
      { status: 500 },
    );
  }
}
