import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import fs from "fs";
import { corsHeaders } from "@/utils/cors";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const partner = await prisma.partner.findUnique({
      where: { id },
      include: {
        favoritePartners: true,
        typePartner: true,
        role: true,
        skuPartners: true,
      },
    });

    if (!partner) {
      return NextResponse.json(
        { message: "Partner not found" },

        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { message: "Partner retrieved successfully", partner },

      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error fetching partner:", error);

    return NextResponse.json(
      { error: "Failed to retrieve partner" },

      { status: 500, headers: corsHeaders },
    );
  }
}

// 🟡 PATCH: Update a partner's details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const formData = await req.formData();

    const existingPartner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const updateData: any = {
      username:
        (formData.get("username") as string) || existingPartner.username,
      firstName:
        (formData.get("firstName") as string) || existingPartner.firstName,
      lastName:
        (formData.get("lastName") as string) || existingPartner.lastName,
      email: (formData.get("email") as string) || existingPartner.email,
      telephone:
        (formData.get("telephone") as string) || existingPartner.telephone,
      address: (formData.get("address") as string) || existingPartner.address,
      responsibleName:
        (formData.get("responsibleName") as string) ||
        existingPartner.responsibleName,
      position:
        (formData.get("position") as string) || existingPartner.position,
      coverageArea:
        (formData.get("coverageArea") as string) ||
        existingPartner.coverageArea,
      typePartnerId:
        (formData.get("typePartnerId") as string) ||
        existingPartner.typePartnerId,
      mRoleId: (formData.get("mRoleId") as string) || existingPartner.mRoleId,
    };

    const minimumAmountStr = formData.get("minimumAmount") as string;
    updateData.minimumAmount = minimumAmountStr
      ? parseFloat(minimumAmountStr)
      : existingPartner.minimumAmount;

    const isActiveStr = formData.get("isActive") as string;
    if (isActiveStr !== null) {
      updateData.isActive = isActiveStr === "true";
    } else {
      updateData.isActive = existingPartner.isActive;
    }

    const password = formData.get("password") as string;
    if (password) {
      const hashedPassword = await hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (updateData.username !== existingPartner.username) {
      const existingUsername = await prisma.partner.findFirst({
        where: { username: updateData.username },
      });
      if (existingUsername) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 },
        );
      }
    }

    // Check email uniqueness only if it's being changed
    if (updateData.email !== existingPartner.email) {
      const existingEmail = await prisma.partner.findFirst({
        where: { email: updateData.email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 },
        );
      }
    }

    // Handle file updates
    let logoUrl = existingPartner.logo;
    let patentUrl = existingPartner.patent;

    // Process logo
    const removeLogo = formData.get("removeLogo") === "true";
    const newLogoFile = formData.get("logo") as File | null;

    if (removeLogo) {
      if (logoUrl) {
        const oldLogoPath = path.join(process.cwd(), "public", logoUrl);
        await unlink(oldLogoPath).catch(console.error);
        logoUrl = null;
      }
    }

    if (newLogoFile) {
      const validLogoTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validLogoTypes.includes(newLogoFile.type)) {
        return NextResponse.json(
          { error: "Invalid logo image format" },
          { status: 400 },
        );
      }

      // Delete old logo
      if (logoUrl) {
        const oldLogoPath = path.join(process.cwd(), "public", logoUrl);
        await unlink(oldLogoPath).catch(console.error);
      }

      // Upload new logo
      const buffer = Buffer.from(await newLogoFile.arrayBuffer());
      const fileName = `logo-${Date.now()}-${newLogoFile.name}`;
      const uploadPath = path.join(
        process.cwd(),
        "public/uploads/partners/logos",
        fileName,
      );

      await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
      await writeFile(uploadPath, buffer);
      logoUrl = `/uploads/partners/logos/${fileName}`;
    }

    // Process patent
    const removePatent = formData.get("removePatent") === "true";
    const newPatentFile = formData.get("patent") as File | null;

    if (removePatent) {
      if (patentUrl) {
        const oldPatentPath = path.join(process.cwd(), "public", patentUrl);
        await unlink(oldPatentPath).catch(console.error);
        patentUrl = null;
      }
    }

    if (newPatentFile) {
      // Validate file type
      if (newPatentFile.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Invalid patent file format" },
          { status: 400 },
        );
      }

      // Delete old patent
      if (patentUrl) {
        const oldPatentPath = path.join(process.cwd(), "public", patentUrl);
        await unlink(oldPatentPath).catch(console.error);
      }

      // Upload new patent
      const buffer = Buffer.from(await newPatentFile.arrayBuffer());
      const fileName = `patent-${Date.now()}-${newPatentFile.name}`;
      const uploadPath = path.join(
        process.cwd(),
        "public/uploads/partners/patents",
        fileName,
      );

      await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
      await writeFile(uploadPath, buffer);
      patentUrl = `/uploads/partners/patents/${fileName}`;
    }

    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Partner updated successfully", partner: updatedPartner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    //Session Authorization
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    //Permission Check
    let user = session.user as {
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
          rp.permission?.resource === "Partner" &&
          rp.actions.includes("delete"),
      );

      if (!canDelete) {
        return NextResponse.json(
          { message: "Forbidden: missing 'delete' permission for Partner" },
          { status: 403 },
        );
      }
    }

    const { id } = params;

    await prisma.partner.delete({ where: { id } });

    return NextResponse.json(
      { message: "Partner deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 },
    );
  }
}
