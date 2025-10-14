import { prismaClient } from "./prismaClient";

export const editUser = async (username: string, props: any) => {
  await prismaClient.user.update({
    where: { username },
    data: { ...props },
  });
};
