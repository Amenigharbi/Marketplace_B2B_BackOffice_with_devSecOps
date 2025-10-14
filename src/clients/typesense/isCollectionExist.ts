import { typesenseClient } from "./typesenseClient";

export const isCollectionExist = async (
  collectionName: string,
): Promise<boolean> => {
  try {
    await typesenseClient.collections(collectionName).retrieve();
    return true;
  } catch {
    return false;
  }
};
