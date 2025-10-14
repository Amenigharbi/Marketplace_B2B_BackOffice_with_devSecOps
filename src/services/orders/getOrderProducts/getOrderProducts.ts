import { magento } from "@/clients/magento";
import { logError } from "@/utils/logError";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";

export const getOrderProducts = async (orderId: string): Promise<any> => {
  const session = await auth();
  if (!session?.user) {
    return { orders: [], count: 0 };
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
    const magnetoOrderProducts: any[] = await magento.queries.getOrderProducts(
      orderId,
    );

    const orderProducts = magnetoOrderProducts.map((item) => {
      const { id, sku, name, price, custom_attributes, extension_attributes } =
        item;

      const description = custom_attributes.find(
        (attr: any) => attr.attribute_code === "description",
      )?.value;

      const pcb = Number(
        custom_attributes.find((attr: any) => attr.attribute_code === "qty_pcb")
          ?.value,
      );
      //const minSaleQuantity = Number(extension_attributes.stock_item.qty_increments,);
      const qtyIncrements = Number(
        extension_attributes.stock_item.qty_increments,
      );
      const minSaleQuantity = qtyIncrements === 0 ? 1 : qtyIncrements;

      const brand = custom_attributes.find(
        (attr: any) => attr.attribute_code === "brand",
      )?.value;

      return {
        id,
        sku,
        pcb,
        name,
        brand,
        price,
        description,
        minSaleQuantity,
      };
    });

    return orderProducts;
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
    throw error;
  }
};
