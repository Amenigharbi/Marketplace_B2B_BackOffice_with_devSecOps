import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/clients/prisma";
import { responses } from "@/utils/responses";
import { logError } from "@/utils/logError";
import { createLog } from "../../../../clients/prisma/getLogs";
import { auth } from "../../../../services/auth";

export const PUT = async (request: NextRequest) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const User = session.user as {
    id: string;
    roleId: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  try {
    const { status, username } = await request.json();

    if (!username) {
      return responses.invalidRequest("username is Required");
    }
    if (!status) {
      return responses.invalidRequest("status is Required");
    }

    let user = await prisma.getUser(username);

    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    if (status === "active") {
      await prisma.editUser(username, { isActive: true });
    }
    if (status === "inactive") {
      await prisma.editUser(username, { isActive: false });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    await createLog({
      type: "error",
      message: (error as Error).message || "Internal Server Error",
      context: {
        userId: User.id,
        username: User.username,
      },
      timestamp: new Date(),
      dataBefore: {},
      dataAfter: "error",
      id: "",
    });
    logError(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
};
