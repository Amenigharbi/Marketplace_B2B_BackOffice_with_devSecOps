// app/api/subCategories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🟢 GET: Retrieve all subcategories
export async function GET() {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // let user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // // Check if user is KamiounAdminMaster
    // const isAdmin = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    //   select: { name: true },
    // });

    // if (isAdmin?.name !== "KamiounAdminMaster") {
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
    //       rp.permission?.resource === "SubCategory" &&
    //       rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'read' permission for SubCategory" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: true, // Include related category details
      },
    });

    return NextResponse.json(
      { message: "SubCategories retrieved successfully", subCategories },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching subCategories:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subCategories" },
      { status: 500 },
    );
  }
}
