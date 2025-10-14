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

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Valider l'ID
    const { id } = params;
    if (!id) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "ID is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    // 2. Récupérer le productType
    const productType = await prisma.productType.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
      },
    });

    if (!productType) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "ProductType not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    // 3. Retourner la réponse
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: productType,
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
    console.error("[PRODUCT_TYPE_GET_ERROR]", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Internal server error",
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

// PUT: Update a ProductType
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Allow access if user is KamiounAdminMaster
    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
      if (!user.mRoleId) {
        return NextResponse.json({ message: "No role found" }, { status: 403 });
      }

      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canUpdate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Product Type" &&
          rp.actions.includes("update"),
      );

      if (!canUpdate) {
        return NextResponse.json(
          {
            message: "Forbidden: missing 'update' permission for Product Type",
          },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    const { type } = await req.json();

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const updatedProductType = await prisma.productType.update({
      where: { id },
      data: { type },
    });

    return NextResponse.json(
      {
        message: "ProductType updated successfully",
        productType: updatedProductType,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating ProductType:", error);
    return NextResponse.json(
      { error: "Failed to update ProductType" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a ProductType
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    // Get user's role
    const userRole = await prisma.role.findUnique({
      where: { id: user.mRoleId },
    });

    // Allow access if user is KamiounAdminMaster
    const isKamiounAdminMaster = userRole?.name === "KamiounAdminMaster";

    if (!isKamiounAdminMaster) {
      if (!user.mRoleId) {
        return NextResponse.json({ message: "No role found" }, { status: 403 });
      }

      const rolePermissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.mRoleId,
        },
        include: {
          permission: true,
        },
      });

      const canDelete = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "Product Type" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          {
            message: "Forbidden: missing 'delete' permission for Product Type",
          },
          { status: 403 },
        );
      }
    }

    const { id } = params;
    await prisma.productType.delete({ where: { id } });

    return NextResponse.json(
      { message: "ProductType deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting ProductType:", error);
    return NextResponse.json(
      { error: "Failed to delete ProductType" },
      { status: 500 },
    );
  }
}
