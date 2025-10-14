import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { orderProcessingDuration } from "@/libs/metrics";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const end = orderProcessingDuration.startTimer({
    route: "/api/marketplace/orders/create",
  });
  try {
    const body = await req.json();

    const reservation = await prisma.reservation.findUnique({
      where: { id: body.reservationId },
      include: {
        reservationItems: {
          include: {
            product: true,
            source: true,
            partner: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        {
          error: {
            message: `La réservation #${body.reservationId} est introuvable.`,
            code: "RESERVATION_NOT_FOUND",
          },
        },
        { status: 404 },
      );
    }

    const stateName = body.isActive ? "new" : "canceled";
    const state = await prisma.state.findUnique({ where: { name: stateName } });

    if (!state) {
      return NextResponse.json(
        {
          error: {
            message: `L'état '${stateName}' n'existe pas.`,
            code: "STATE_NOT_FOUND",
          },
        },
        { status: 400 },
      );
    }

    let status = await prisma.status.findUnique({
      where: { name: "open", stateId: state.id },
    });

    if (!status) {
      status = await prisma.status.create({
        data: { name: "open", stateId: state.id },
      });
    }

    // Vérification supplémentaire pour s'assurer que le statut existe
    if (!status) {
      return NextResponse.json(
        {
          error: {
            message:
              "Impossible de créer ou trouver le statut 'open' pour la commande.",
            code: "STATUS_CREATION_FAILED",
          },
        },
        { status: 500 },
      );
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const orderItemsData = await Promise.all(
        reservation.reservationItems.map(async (item) => {
          if (item.sourceId) {
            const stock = await tx.stock.findFirst({
              where: {
                skuPartner: {
                  skuProduct: item.sku,
                  productId: item.productId,
                },
                sourceId: item.sourceId,
              },
              include: {
                skuPartner: true,
              },
            });

            if (!stock) {
              throw {
                type: "BUSINESS",
                code: "STOCK_NOT_FOUND",
                message: `Stock indisponible pour le produit '${
                  item.product.name
                }' (SKU: ${item.sku}) dans '${
                  item.source?.name || "source inconnue"
                }'.`,
              };
            }

            if (stock.stockQuantity < item.qteReserved) {
              throw {
                type: "BUSINESS",
                code: "STOCK_INSUFFICIENT",
                message: `Stock insuffisant pour '${item.product.name}' (${item.sku}) à '${item.source?.name}'. Disponible: ${stock.stockQuantity}, Requis: ${item.qteReserved}.`,
              };
            }

            await tx.stock.update({
              where: { id: stock.id },
              data: {
                stockQuantity: {
                  decrement: item.qteReserved,
                },
              },
            });
          }

          return {
            qteOrdered: item.qteReserved,
            qteRefunded: 0,
            qteShipped: 0,
            qteCanceled: 0,
            discountedPrice: item.discountedPrice,
            weight: item.weight,
            sku: item.sku,
            product: { connect: { id: item.productId } },
            source: item.sourceId
              ? { connect: { id: item.sourceId } }
              : undefined,
            partner: item.partnerId
              ? { connect: { id: item.partnerId } }
              : undefined,
          };
        }),
      );

      return await tx.order.create({
        data: {
          amountTTC: body.amountTTC,
          amountRefunded: body.amountRefunded || 0,
          amountCanceled: body.amountCanceled || 0,
          amountOrdered: body.amountOrdered,
          amountShipped: body.amountShipped || 0,
          shippingMethod: body.shippingMethod,
          shippingAmount: body.shippingAmount,
          fromMobile: body.fromMobile,
          weight: body.weight,
          isActive: body.isActive,
          status: { connect: { id: status?.id } },
          state: { connect: { id: state.id } },
          paymentMethod: { connect: { id: body.paymentMethodId } },
          customer: { connect: { id: body.customerId } },
          agent: body.agentId ? { connect: { id: body.agentId } } : undefined,
          reservation: body.reservationId
            ? { connect: { id: body.reservationId } }
            : undefined,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
              source: true,
              partner: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        message: "Commande créée avec succès, les stocks ont été mis à jour.",
        order: newOrder,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);

    if (
      typeof error === "object" &&
      error &&
      (error as any).type === "BUSINESS"
    ) {
      return NextResponse.json(
        {
          error: {
            message: (error as any).message,
            code: (error as any).code,
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: {
          message: "Une erreur inattendue est survenue.",
          code: "INTERNAL_SERVER_ERROR",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  } finally {
    end();
  }
}
