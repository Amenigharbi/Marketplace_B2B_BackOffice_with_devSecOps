// app/api/marketplace/sources/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return new NextResponse(
    //     JSON.stringify({ message: "Unauthorized" }),
    //     {
    //       status: 401,
    //       headers: corsHeaders
    //     }
    //   );
    // }

    // let user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    //   userType?: string;
    // };

    // // Get user's role
    // const userRole = await prisma.role.findUnique({
    //   where: {
    //     id: user.mRoleId,
    //   },
    // });

    // // Allow access if user is KamiounAdminMaster
    // const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    // if (!isKamiounAdminMaster) {
    //   if (!user.mRoleId) {
    //     return new NextResponse(
    //       JSON.stringify({ message: "No role found" }),
    //       {
    //         status: 403,
    //         headers: corsHeaders
    //       }
    //     );
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
    //       rp.permission?.resource === "Source" && rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return new NextResponse(
    //       JSON.stringify({
    //         message: "Forbidden: missing 'read' permission for Source"
    //       }),
    //       {
    //         status: 403,
    //         headers: corsHeaders
    //       }
    //     );
    //   }
    // }

    // // Filter sources by partnerId if user is a partner
    // let whereClause = {};
    // if (user.userType === "partner") {
    //   whereClause = { partnerId: user.id };
    // }

    const sources = await prisma.source.findMany({
      // where: whereClause,
      include: {
        partner: true,
        stock: true,
      },
    });

    if (sources.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "No sources found",
          data: [],
          meta: { count: 0 },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Sources retrieved successfully",
        data: sources,
        meta: { count: sources.length },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Error fetching sources:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Failed to retrieve sources",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
}
