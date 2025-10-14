type Item = {
  id: string;
  sku: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: string;

  weight: number;
  quantity: number;
  totalPrice: number;
};

export const getOrderItems = (orderItems: any): Item[] =>
  orderItems?.map((item: any) => {
    return {
      sku: String(item.sku),
      id: String(item.item_id),
      weight: String(item.weight),
      orderId: String(item.order_id),
      productName: String(item.name),
      totalPrice: String(item.price),
      productId: String(item.product_id),
      quantity: String(item.qty_ordered),
      productPrice: String(item.base_price),
    };
  }) || [];
