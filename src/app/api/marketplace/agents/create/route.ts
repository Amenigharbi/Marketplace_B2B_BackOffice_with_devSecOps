import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create a new agent
export async function POST(req: Request) {
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

    //   const canCreate = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Delivery Agent" &&
    //       rp.actions.includes("create"),
    //   );

    //   if (!canCreate) {
    //     return NextResponse.json(
    //       {
    //         message:
    //           "Forbidden: missing 'create' permission for Delivery Agent",
    //       },
    //       { status: 403 },
    //     );
    //   }
    // }

    const body = await req.json();

    // Check if any data exist
    const existingData = await prisma.agent.findFirst();

    if (!existingData) {
      const existingPermission = await prisma.permission.findFirst({
        where: {
          resource: "Delivery Agent",
        },
      });

      if (!existingPermission) {
        await prisma.permission.create({
          data: {
            resource: "Delivery Agent",
          },
        });
      }
    }

    // Hash the password before storing it
    const hashedPassword = await hash(body.password, 10);

    // Create the agent in the database
    const newAgent = await prisma.agent.create({
      data: {
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        telephone: body.telephone,
        address: body.address,
        password: hashedPassword, // Store hashed password
        mRoleId: body.mRoleId,
        isActive: body.isActive ?? true, // Default to true if not provided
      },
    });

    return NextResponse.json(
      { message: "Agent created successfully", agent: newAgent },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 },
    );
  }
}
