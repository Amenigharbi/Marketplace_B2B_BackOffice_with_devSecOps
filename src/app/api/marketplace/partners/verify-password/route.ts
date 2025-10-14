import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isPasswordValid } from "@/utils/password/isPasswordValid";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { partnerId, password } = await req.json();

    if (!partnerId || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get the partner
    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    // Verify the current user is authorized (either the partner themselves or an admin)
    const user = session.user as {
      id: string;
      userType?: string;
      mRoleId?: string;
    };

    const isAdmin = user.userType === "admin";
    const isPartnerOwner = user.id === partnerId;

    if (!isAdmin && !isPartnerOwner) {
      return NextResponse.json(
        { error: "Not authorized to verify this password" },
        { status: 403 },
      );
    }

    // Verify password
    const isValid = await isPasswordValid(password, partner.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "Password verified successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { error: "Failed to verify password" },
      { status: 500 },
    );
  }
}
