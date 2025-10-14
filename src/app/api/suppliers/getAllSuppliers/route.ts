export const revalidate = 0;

import { logError } from "@/utils/logError";
import { responses } from "@/utils/responses";
import { NextResponse, type NextRequest } from "next/server";
import { getAllSuppliers } from "@/services/supplier/getAllSuppliers";
import { auth } from "../../../../services/auth";
import { createLog } from "../../../../clients/prisma/getLogs";

export const GET = async (request: NextRequest) => {
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
    const suppliers = await getAllSuppliers();
    return NextResponse.json(
      {
        message: "success",
        suppliers,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    await createLog({
      type: "error",
      message: error.message || "Internal Server Error",
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

    return responses.internalServerError();
  }
};
