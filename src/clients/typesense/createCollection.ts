import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const createCollection = async (
  collection: CollectionCreateSchema,
): Promise<{ success: boolean; message?: string }> => {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
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
    await typesenseClient.collections().create(collection);
    return { success: true };
  } catch (error: any) {
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

    const message: string = error?.message ?? "";

    if (message.includes("Request failed with HTTP code 409")) {
      return { success: false, message: "conflict" };
    }

    if (message.includes("Request failed with HTTP code 400")) {
      return { success: false, message: message };
    }

    return { success: false, message: "internal_server_error" };
  }
};
