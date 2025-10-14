// app/api/statuses/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve all statuses
export async function GET(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // const user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // // Get user's role
    // const userRole = await prisma.role.findFirst({
    //   where: { id: user.mRoleId },
    // });

    // // Allow access if user is KamiounAdminMaster
    // const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    // if (!isKamiounAdminMaster) {
    //   if (!user.mRoleId) {
    //     return NextResponse.json({ message: "No role found" }, { status: 403 });
    //   }

    //   const rolePermissions = await prisma.rolePermission.findMany({
    //     where: {
    //       roleId: user.mRoleId,
    //     },
    //     include: {
    //       permission: true,
    //     },
    //   });

    //   const canRead = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Status" && rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'read' permission for Status" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const statuses = await prisma.status.findMany({
      include: {
        orders: true,
        state: true,
      },
    }); // Retrieve all statuses

    if (statuses.length === 0) {
      return NextResponse.json(
        { message: "No statuses found", statuses: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Statuses retrieved successfully", statuses },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json(
      { error: "Failed to retrieve statuses" },
      { status: 500 },
    );
  }
}
