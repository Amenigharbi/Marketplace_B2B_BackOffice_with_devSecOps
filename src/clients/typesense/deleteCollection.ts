import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { isCollectionExist } from "./isCollectionExist";

export const deleteCollection = async (
  collectionName: string,
): Promise<any> => {
  try {
    if (!isCollectionExist(collectionName)) {
      throw new Error(`Collection "${collectionName}" does not exist.`);
    }

    await typesenseClient.collections(collectionName).delete();
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while deleting the collection.",
    );
  }
};
