import { getOrder } from "./orders/getOrder";
import { addOrder } from "./orders/addOrder";
import { updateOrder } from "./orders/updateOrder";
import { getManyOrders } from "./orders/getManyOrders";
import { addOrdersBatch } from "./orders/addOrdersBatch";
import { isCollectionExist } from "./isCollectionExist";
import { createOrdersCollection } from "./orders/createOrdersCollection";
import { deleteOrdersCollection } from "./orders/deleteOrdersCollection";
import { getNumberOfOrdersByDay } from "./orders/numberOfOrders/getNumberOfOrdersByDay";
import { getNumberOfOrdersByQuarter } from "./orders/numberOfOrders/getNumberOfOrdersByQuarter";
import { getNumberOfOrdersByMonth } from "./orders/numberOfOrders/getNumberOfOrdersByMonth";
import { getGmvByQuarter } from "./orders/gmv/getGmvByQuarter";
import { getGmvByMonth } from "./orders/gmv/getGmvByMonth";
import { getGmvByDay } from "./orders/gmv/getGmvByDay";
import { cancelOrder } from "./orders/cancelOrder";

export const typesense = {
  isCollectionExist,
  orders: {
    getOne: getOrder,
    addOne: addOrder,
    getMany: getManyOrders,
    updateOne: updateOrder,
    cancelOne: cancelOrder,
    addMany: addOrdersBatch,
    createCollection: createOrdersCollection,
    deleteCollection: deleteOrdersCollection,
    numberOfOrders: {
      byDay: getNumberOfOrdersByDay,
      byMonth: getNumberOfOrdersByMonth,
      byQuarter: getNumberOfOrdersByQuarter,
    },
    gmv: {
      byDay: getGmvByDay,
      byQuarter: getGmvByQuarter,
      byMonth: getGmvByMonth,
    },
  },
};
