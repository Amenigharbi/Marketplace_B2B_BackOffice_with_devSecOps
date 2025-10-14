import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let user = session.user as {
      id: string;
      roleId: string;
      mRoleId: string;
      username: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
    };

    // Check if user is KamiounAdminMaster
    const isAdmin = await prisma.role.findUnique({
      where: { id: user.mRoleId },
      select: { name: true },
    });

    if (isAdmin?.name !== "KamiounAdminMaster") {
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

      const canCreate = rolePermissions.some(
        (rp) =>
          rp.permission?.resource === "SubCategory" &&
          rp.actions.includes("create"),
      );

      if (!canCreate) {
        return NextResponse.json(
          { message: "Forbidden: missing 'create' permission for SubCategory" },
          { status: 403 },
        );
      }
    }

    const formData = await req.formData();

    const existingData = await prisma.subCategory.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "SubCategory",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "SubCategory",
          },
        });
      }
    }

    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const isActive = formData.get("isActive") === "true";
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Name and categoryId are required" },
        { status: 400 },
      );
    }

    let imageUrl: string | null = null;

    if (imageFile) {
      // Ensure file is an image
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Invalid image format" },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    // Create new subcategory in Prisma
    const newSubCategory = await prisma.subCategory.create({
      data: {
        name,
        categoryId,
        isActive,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json(
      {
        message: "Subcategory created successfully",
        subCategory: newSubCategory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 },
    );
  }
}
