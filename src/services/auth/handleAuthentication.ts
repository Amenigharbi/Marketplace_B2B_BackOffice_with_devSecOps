import { prisma } from "@/clients/prisma";
import { prismaClient } from "@/clients/prisma/prismaClient";
import { isPasswordValid } from "@/utils/password/isPasswordValid";
import { logError } from "@/utils/logError";

export const handleAuthentication = async (
  username: string,
  password: string,
): Promise<any> => {
  try {
    // First try to find a user
    const user = await prisma.getUser(username);

    if (user) {
      const isValid = await isPasswordValid(password, user.password);
      if (isValid) {
        return {
          ...user,
          userType: "admin", // Add a type to distinguish
        };
      } else {
        throw new Error("Wrong Password");
      }
    }

    // If no user found, try to find a partner
    const partner = await prismaClient!.partner.findUnique({
      where: { username },
      include: { role: true },
    });

    if (partner) {
      const isValid = await isPasswordValid(password, partner.password);
      if (isValid) {
        return {
          id: partner.id,
          username: partner.username,
          firstName: partner.firstName,
          lastName: partner.lastName,
          roleId: partner.typePartnerId,
          mRoleId: partner.mRoleId,
          isActive: partner.isActive,
          userType: "partner", // Add a type to distinguish
        };
      } else {
        throw new Error("Wrong Password");
      }
    }

    throw new Error("User Not Found");
  } catch (error) {
    logError(error);
    return null;
  }
};
