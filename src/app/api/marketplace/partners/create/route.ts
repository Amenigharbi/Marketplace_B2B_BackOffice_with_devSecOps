import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
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

    // // Get user's role to check if they're KamiounAdminMaster
    // const userRole = await prisma.role.findUnique({
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

    //   const canCreate = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Partner" &&
    //       rp.actions.includes("create"),
    //   );

    //   if (!canCreate) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'create' permission for Partner" },
    //       { status: 403 },
    //     );
    //   }
    // }

    // Get form data first before any other processing
    const formData = await req.formData();

    const existingData = await prisma.partner.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Partner",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Partner",
          },
        });
      }
    }

    // Validate required fields
    const requiredFields = [
      "username",
      "email",
      "password",
      "mRoleId",
      "typePartnerId",
      "firstName",
      "lastName",
      "telephone",
      "address",
      "responsibleName",
      "position",
      "coverageArea",
      "minimumAmount",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData.get(field),
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Extract and convert values
    const minimumAmount = parseFloat(formData.get("minimumAmount") as string);
    if (isNaN(minimumAmount)) {
      return NextResponse.json(
        { error: "Invalid minimum amount" },
        { status: 400 },
      );
    }

    // Check for existing partner
    const existingPartner = await prisma.partner.findFirst({
      where: {
        OR: [
          { username: formData.get("username") as string },
          { email: formData.get("email") as string },
        ],
      },
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 },
      );
    }

    // File handling
    const handleFileUpload = async (
      file: File | null,
      types: string[],
      folder: string,
    ) => {
      try {
        if (!file) return null;

        if (!types.includes(file.type)) {
          throw new Error(`Invalid file type for ${folder}`);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${folder}-${Date.now()}-${file.name}`;
        const uploadPath = path.join(
          process.cwd(),
          "public/uploads/partners",
          folder,
          fileName,
        );

        await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
        await writeFile(uploadPath, buffer);
        return `/uploads/partners/${folder}/${fileName}`;
      } catch (error) {
        console.error(`File upload error (${folder}):`, error);
        throw new Error(`Failed to upload ${folder} file`);
      }
    };

    const [logoUrl, patentUrl] = await Promise.all([
      handleFileUpload(
        formData.get("logo") as File | null,
        ["image/jpeg", "image/png", "image/webp"],
        "logos",
      ),
      handleFileUpload(
        formData.get("patent") as File | null,
        ["application/pdf"],
        "patents",
      ),
    ]);

    // Hash password
    const hashedPassword = await hash(formData.get("password") as string, 10);

    // Create partner
    const newPartner = await prisma.partner.create({
      data: {
        username: formData.get("username") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        telephone: formData.get("telephone") as string,
        address: formData.get("address") as string,
        password: hashedPassword,
        mRoleId: formData.get("mRoleId") as string,
        responsibleName: formData.get("responsibleName") as string,
        position: formData.get("position") as string,
        coverageArea: formData.get("coverageArea") as string,
        minimumAmount,
        typePartnerId: formData.get("typePartnerId") as string,
        logo: logoUrl,
        patent: patentUrl,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Partner created successfully", partner: newPartner },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create partner" },
      { status: 500 },
    );
  }
}
