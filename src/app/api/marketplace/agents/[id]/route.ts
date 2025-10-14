import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// 🔵 GET: Retrieve an agent by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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
    //       rp.permission?.resource === "Delivery Agent" &&
    //       rp.actions.includes("read"),
    //   );

    //   if (!canRead) {
    //     return NextResponse.json(
    //       {
    //         message: "Forbidden: missing 'read' permission for Delivery Agent",
    //       },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });

    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Agent retrieved successfully", agent },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Failed to retrieve agent" },
      { status: 500 },
    );
  }
}

// 🟡 PATCH: Update agent details
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    //   const canUpdate = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Delivery Agent" &&
    //       rp.actions.includes("update"),
    //   );

    //   if (!canUpdate) {
    //     return NextResponse.json(
    //       {
    //         message:
    //           "Forbidden: missing 'update' permission for Delivery Agent",
    //       },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    const formData = await req.formData();

    const existingAgent = await prisma.agent.findUnique({ where: { id } });
    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const updateData: any = {};
    const fields = [
      "username",
      "firstName",
      "lastName",
      "telephone",
      "address",
      "governate",
      "gender",
    ];

    for (const field of fields) {
      const value = formData.get(field);
      if (value !== null && value !== "") {
        updateData[field] = value;
      }
    }

    // Gestion de isActive
    const isActive = formData.get("isActive");
    if (isActive !== null) {
      updateData.isActive = isActive === "true";
    }

    // Vérifie doublons email / username uniquement si changement
    if (updateData.username && updateData.username !== existingAgent.username) {
      const userExists = await prisma.agent.findFirst({
        where: { username: updateData.username },
      });
      if (userExists) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 },
        );
      }
    }

    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Agent updated successfully", agent: updatedAgent },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent", details: error.message },
      { status: 500 },
    );
  }
}

// 🔴 DELETE: Remove agent
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

    //   const canDelete = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Delivery Agent" &&
    //       rp.actions.includes("delete"),
    //   );

    //   if (!canDelete) {
    //     return NextResponse.json(
    //       {
    //         message:
    //           "Forbidden: missing 'delete' permission for Delivery Agent",
    //       },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    await prisma.agent.delete({ where: { id } });

    return NextResponse.json(
      { message: "Agent deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 },
    );
  }
}
