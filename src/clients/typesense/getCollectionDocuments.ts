import { typesenseClient } from "@/clients/typesense/typesenseClient";
import { logError } from "@/utils/logError";

export const getCollectionDocuments = async (
  collectionName: string,
  filterBy?: string,
  queryBy?: string,
): Promise<{ found: number; documents: any[]; error?: string }> => {
  try {
    const searchParameters = {
      filter_by: filterBy,
      q: "*",
      query_by: queryBy,
      per_page: 250,
    };

    let allDocuments: any[] = [];
    let currentPage = 1;
    let result;

    do {
      result = await typesenseClient
        .collections(collectionName)
        .documents()
        .search({ ...searchParameters, page: currentPage });

      if (result.hits) {
        allDocuments = allDocuments.concat(
          result.hits.map((hit) => hit.document),
        );
      }
      currentPage++;
    } while (result.hits && result.hits.length > 0);

    return {
      found: allDocuments.length,
      documents: allDocuments,
    };
  } catch (error: any) {
    logError(error);
    return {
      found: 0,
      documents: [],
      error: error.message || "An error occurred",
    };
  }
};
