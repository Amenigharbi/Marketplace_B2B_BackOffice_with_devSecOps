export const getMergedItems = ({
  typesenseOrderItems,
  magentoOrderProducts,
}: any): any[] => {
  if (typesenseOrderItems?.length > 0 && magentoOrderProducts?.length > 0) {
    const mergedItems = typesenseOrderItems.map((item: any) => {
      const product = magentoOrderProducts?.find((p: any) => p.sku == item.sku);
      if (product) {
        return { ...item, ...product, id: item.id };
      }
    });

    return mergedItems;
  }
  return [];
};
