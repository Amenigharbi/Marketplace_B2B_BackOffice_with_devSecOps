export const getOrderProductsNames = (orderItems: any): string[] =>
  orderItems?.map((item: any) => {
    return item.productName;
  }) || [];
