import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
const prisma = new PrismaClient();
// GET, PATCH, DELETE a RolePermission by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    const rolePermission = await prisma.rolePermission.findUnique({
      where: { id },
      include: {
        role: true,
        permission: true,
      },
    });
    if (!rolePermission) {
      return NextResponse.json(
        { message: "RolePermission not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Fetched successfully", rolePermission },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching RolePermission:", error);
    return NextResponse.json(
      { error: "Failed to fetch RolePermission" },
      { status: 500 },
    );
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    const { roleId, permissionId, actions } = await req.json();

    if (!roleId || !permissionId) {
      return NextResponse.json(
        { error: "roleId and permissionId are required." },
        { status: 400 },
      );
    }

    if (!Array.isArray(actions)) {
      return NextResponse.json(
        { error: "actions must be an array of strings." },
        { status: 400 },
      );
    }

    // If actions array is empty, delete the role permission
    if (actions.length === 0) {
      await prisma.rolePermission.delete({
        where: { id },
      });

      return NextResponse.json(
        { message: "RolePermission deleted successfully" },
        { status: 200 },
      );
    }

    const updated = await prisma.rolePermission.update({
      where: { id },
      data: {
        roleId,
        permissionId,
        actions,
      },
    });
    return NextResponse.json(
      { message: "Updated successfully", rolePermission: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating RolePermission:", error);
    return NextResponse.json(
      { error: "Failed to update RolePermission" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    await prisma.rolePermission.delete({ where: { id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting RolePermission:", error);
    return NextResponse.json(
      { error: "Failed to delete RolePermission" },
      { status: 500 },
    );
  }
}
