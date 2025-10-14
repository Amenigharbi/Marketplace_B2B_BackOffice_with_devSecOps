import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";
import { convertIsoDate2MagentoDate } from "@/utils/date/convertIsoDate2MagentoDate";
import { isValidISODate } from "@/utils/date/isValidIsoDate";
import { createLog } from "@/clientsprisma/getLogs";
import { auth } from "@/servicesauth";
import { NextResponse } from "next/server";

export const editOrderDetails = async ({
  orderId,
  deliveryDate,
  items,
  total,
  status,
  state,
}: any): Promise<any> => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
    const magentoItems = items?.map((item: any) => {
      return { item_id: item.id, weight: item.weight };
    });

    let data;

    if (isValidISODate(deliveryDate)) {
      data = {
        entity: {
          entity_id: orderId,

          items: magentoItems,
          total: total || 0,

          extension_attributes: {
            delivery_date: convertIsoDate2MagentoDate(deliveryDate),
          },
        },
      };
    } else {
      data = {
        entity: {
          entity_id: orderId,
          items: magentoItems,
          total: total || 0,
        },
      };
    }

    await axios.magentoClient.put("orders/update_qty", data);
  } catch (error) {
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
    throw new Error();
  }
};
