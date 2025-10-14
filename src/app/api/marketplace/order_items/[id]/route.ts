import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  productStockGauge,
  stockOperationTotal,
  stockUpdateDuration,
} from "@/libs/metrics";

const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 30000,
    timeout: 30000,
  },
});

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    // Vérifier si c'est une mise à jour multiple
    if (Array.isArray(body.updates)) {
      return await handleBulkUpdate(body.updates);
    }

    // Sinon, traitement d'une seule mise à jour
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { message: "Order item ID is required" },
        { status: 400 },
      );
    }

    return await updateSingleOrderItem(id, body);
  } catch (error) {
    console.error("Error updating order items:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order items",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

async function handleBulkUpdate(updates: any[]) {
  const results = await prisma.$transaction(async (tx) => {
    const updateResults = [];

    for (const update of updates) {
      const { id, ...updateData } = update;
      if (!id) {
        throw new Error("Missing ID in one of the update items");
      }

      const result = await processOrderItemUpdate(tx, id, updateData);
      updateResults.push(result);
    }

    return updateResults;
  });

  return NextResponse.json(
    {
      success: true,
      data: results,
    },
    { status: 200 },
  );
}

async function updateSingleOrderItem(id: string, body: any) {
  const currentOrderItem = await prisma.orderItem.findUnique({
    where: { id },
    include: {
      product: true,
      order: true,
      source: true,
      partner: true,
    },
  });

  if (!currentOrderItem) {
    return NextResponse.json(
      { message: "Order item not found" },
      { status: 404 },
    );
  }

  // Prepare update data
  const updateData: {
    qteRefunded?: number;
    qteCanceled?: number;
    qteShipped?: number;
    discountedPrice?: number;
  } = {};

  // Check which fields are being updated
  if (body.qteRefunded !== undefined) {
    updateData.qteRefunded = parseFloat(body.qteRefunded.toFixed(2));
  }
  if (body.qteCanceled !== undefined) {
    updateData.qteCanceled = parseFloat(body.qteCanceled.toFixed(2));
  }
  if (body.qteShipped !== undefined) {
    updateData.qteShipped = parseFloat(body.qteShipped.toFixed(2));
  }
  if (body.discountedPrice !== undefined) {
    updateData.discountedPrice = parseFloat(body.discountedPrice.toFixed(2));
  }

  // Get current values
  const currentShipped = currentOrderItem.qteShipped || 0;
  const currentRefunded = currentOrderItem.qteRefunded || 0;
  const currentCanceled = currentOrderItem.qteCanceled || 0;

  // Calculate new values (fallback to current if not provided)
  const newShipped =
    updateData.qteShipped !== undefined
      ? updateData.qteShipped
      : currentShipped;
  const newRefunded =
    updateData.qteRefunded !== undefined
      ? updateData.qteRefunded
      : currentRefunded;
  const newCanceled =
    updateData.qteCanceled !== undefined
      ? updateData.qteCanceled
      : currentCanceled;

  // Calculate amounts
  const price =
    updateData.discountedPrice !== undefined
      ? updateData.discountedPrice
      : currentOrderItem.discountedPrice;

  const calculateAmount = (qty: number) =>
    parseFloat((qty * (price ?? 0)).toFixed(2));

  // Transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update stock if needed
    if (currentOrderItem.sourceId && currentOrderItem.partnerId) {
      const skuPartner = await tx.skuPartner.findFirst({
        where: {
          productId: currentOrderItem.productId,
          partnerId: currentOrderItem.partnerId,
        },
      });

      if (skuPartner) {
        // Get current stock
        const currentStock = await tx.stock.findUnique({
          where: {
            skuPartnerId_sourceId: {
              skuPartnerId: skuPartner.id,
              sourceId: currentOrderItem.sourceId,
            },
          },
        });

        if (currentStock) {
          // Calculate new stock quantity
          const newStockQuantity =
            currentStock.stockQuantity -
            (newShipped - currentShipped) +
            (newRefunded - currentRefunded) +
            (newCanceled - currentCanceled);

          const endStock = stockUpdateDuration.startTimer({
            route: "/api/marketplace/order_items/[id]",
            product_id: String(currentOrderItem.productId),
            source_id: String(currentOrderItem.sourceId),
          });
          try {
            await tx.stock.update({
              where: {
                skuPartnerId_sourceId: {
                  skuPartnerId: skuPartner.id,
                  sourceId: currentOrderItem.sourceId,
                },
              },
              data: {
                stockQuantity: newStockQuantity,
              },
            });

            const updatedStock = await tx.stock.findUnique({
              where: {
                skuPartnerId_sourceId: {
                  skuPartnerId: skuPartner.id,
                  sourceId: currentOrderItem.sourceId,
                },
              },
            });

            if (updatedStock) {
              productStockGauge.set(
                {
                  product_id: String(currentOrderItem.productId),
                  source_id: String(currentOrderItem.sourceId),
                },
                updatedStock.stockQuantity,
              );
            }

            stockOperationTotal.inc({
              operation: "update",
              result: "success",
              route: "/api/marketplace/order_items/[id]",
              product_id: String(currentOrderItem.productId),
              source_id: String(currentOrderItem.sourceId),
            });
            endStock({ result: "success" });
          } catch (e) {
            stockOperationTotal.inc({
              operation: "update",
              result: "fail",
              route: "/api/marketplace/order_items/[id]",
              product_id: String(currentOrderItem.productId),
              source_id: String(currentOrderItem.sourceId),
            });
            endStock({ result: "fail" });
            throw e;
          }
        }
      }
    }

    // Update order item
    const updatedItem = await tx.orderItem.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
        order: true,
      },
    });

    // Calculate total amounts
    const refundedAmount = calculateAmount(newRefunded);
    const canceledAmount = calculateAmount(newCanceled);
    const shippedAmount = calculateAmount(newShipped);

    // Update order amounts
    await tx.order.update({
      where: { id: currentOrderItem.orderId },
      data: {
        amountRefunded: refundedAmount,
        amountCanceled: canceledAmount,
        amountShipped: shippedAmount,
      },
    });

    return updatedItem;
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        orderItem: result,
        amounts: {
          refunded: calculateAmount(newRefunded),
          canceled: calculateAmount(newCanceled),
          shipped: calculateAmount(newShipped),
        },
        stockChange: {
          shipped: -(newShipped - currentShipped),
          refunded: newRefunded - currentRefunded,
          canceled: newCanceled - currentCanceled,
        },
        priceUsed: price,
        details: {
          shipped: { old: currentShipped, new: newShipped },
          refunded: { old: currentRefunded, new: newRefunded },
          canceled: { old: currentCanceled, new: newCanceled },
        },
      },
    },
    { status: 200 },
  );
}

async function processOrderItemUpdate(tx: any, id: string, updateData: any) {
  const currentOrderItem = await tx.orderItem.findUnique({
    where: { id },
    include: {
      product: true,
      order: true,
      source: true,
      partner: true,
    },
  });

  if (!currentOrderItem) {
    throw new Error(`Order item ${id} not found`);
  }

  // Prepare update data
  const preparedUpdate: any = {};

  if (updateData.qteRefunded !== undefined) {
    preparedUpdate.qteRefunded = parseFloat(updateData.qteRefunded.toFixed(2));
  }
  if (updateData.qteCanceled !== undefined) {
    preparedUpdate.qteCanceled = parseFloat(updateData.qteCanceled.toFixed(2));
  }
  if (updateData.qteShipped !== undefined) {
    preparedUpdate.qteShipped = parseFloat(updateData.qteShipped.toFixed(2));
  }
  if (updateData.discountedPrice !== undefined) {
    preparedUpdate.discountedPrice = parseFloat(
      updateData.discountedPrice.toFixed(2),
    );
  }

  // Get current values
  const currentShipped = currentOrderItem.qteShipped || 0;
  const currentRefunded = currentOrderItem.qteRefunded || 0;
  const currentCanceled = currentOrderItem.qteCanceled || 0;

  // Calculate new values
  const newShipped = preparedUpdate.qteShipped ?? currentShipped;
  const newRefunded = preparedUpdate.qteRefunded ?? currentRefunded;
  const newCanceled = preparedUpdate.qteCanceled ?? currentCanceled;

  const price =
    preparedUpdate.discountedPrice ?? currentOrderItem.discountedPrice;

  const calculateAmount = (qty: number) =>
    parseFloat((qty * (price ?? 0)).toFixed(2));

  // Update stock if needed
  if (currentOrderItem.sourceId && currentOrderItem.partnerId) {
    const skuPartner = await tx.skuPartner.findFirst({
      where: {
        productId: currentOrderItem.productId,
        partnerId: currentOrderItem.partnerId,
      },
    });

    if (skuPartner) {
      const currentStock = await tx.stock.findUnique({
        where: {
          skuPartnerId_sourceId: {
            skuPartnerId: skuPartner.id,
            sourceId: currentOrderItem.sourceId,
          },
        },
      });

      if (currentStock) {
        const newStockQuantity =
          currentStock.stockQuantity -
          (newShipped - currentShipped) +
          (newRefunded - currentRefunded) +
          (newCanceled - currentCanceled);

        const endStock = stockUpdateDuration.startTimer({
          route: "/api/marketplace/order_items/bulk",
          product_id: String(currentOrderItem.productId),
          source_id: String(currentOrderItem.sourceId),
        });

        try {
          await tx.stock.update({
            where: {
              skuPartnerId_sourceId: {
                skuPartnerId: skuPartner.id,
                sourceId: currentOrderItem.sourceId,
              },
            },
            data: {
              stockQuantity: newStockQuantity,
            },
          });

          productStockGauge.set(
            {
              product_id: String(currentOrderItem.productId),
              source_id: String(currentOrderItem.sourceId),
            },
            newStockQuantity,
          );

          stockOperationTotal.inc({
            operation: "update",
            result: "success",
            route: "/api/marketplace/order_items/bulk",
            product_id: String(currentOrderItem.productId),
            source_id: String(currentOrderItem.sourceId),
          });

          endStock({ result: "success" });
        } catch (e) {
          stockOperationTotal.inc({
            operation: "update",
            result: "fail",
            route: "/api/marketplace/order_items/bulk",
            product_id: String(currentOrderItem.productId),
            source_id: String(currentOrderItem.sourceId),
          });
          endStock({ result: "fail" });
          throw e;
        }
      }
    }
  }

  // Update order item
  const updatedItem = await tx.orderItem.update({
    where: { id },
    data: preparedUpdate,
    include: {
      product: true,
      order: true,
    },
  });

  // Calculate amounts
  const refundedAmount = calculateAmount(newRefunded);
  const canceledAmount = calculateAmount(newCanceled);
  const shippedAmount = calculateAmount(newShipped);

  // Update order amounts
  await tx.order.update({
    where: { id: currentOrderItem.orderId },
    data: {
      amountRefunded: refundedAmount,
      amountCanceled: canceledAmount,
      amountShipped: shippedAmount,
    },
  });

  return {
    orderItem: updatedItem,
    amounts: {
      refunded: refundedAmount,
      canceled: canceledAmount,
      shipped: shippedAmount,
    },
    stockChange: {
      shipped: -(newShipped - currentShipped),
      refunded: newRefunded - currentRefunded,
      canceled: newCanceled - currentCanceled,
    },
    priceUsed: price,
    details: {
      shipped: { old: currentShipped, new: newShipped },
      refunded: { old: currentRefunded, new: newRefunded },
      canceled: { old: currentCanceled, new: newCanceled },
    },
  };
}

// 🔴 DELETE: Remove an order item by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    await prisma.orderItem.delete({ where: { id } });

    return NextResponse.json(
      { message: "Order item deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting order item:", error);
    return NextResponse.json(
      { error: "Failed to delete order item" },
      { status: 500 },
    );
  }
}
