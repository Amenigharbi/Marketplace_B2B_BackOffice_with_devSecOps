import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { hashPassword } from "@/utils/password";

export const PUT = async (request: NextRequest) => {
  try {
    const { username, firstName, lastName, mRoleId, roleId, newPassword } =
      await request.json();

    const user = prisma.getUser(username);

    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    await prisma.editUser(username, { firstName, lastName, roleId, mRoleId });
    if (newPassword) {
      const hashedPassword = await hashPassword(newPassword);
      await prisma.editUser(username, { password: hashedPassword });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
};
