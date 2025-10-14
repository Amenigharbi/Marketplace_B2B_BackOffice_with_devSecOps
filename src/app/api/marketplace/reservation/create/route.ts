import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";
import { httpRequestsTotal } from "@/libs/metrics";
const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reservationsData = Array.isArray(body) ? body : [body];
    const createdReservations = [];

    for (const reservationData of reservationsData) {
      if (
        !reservationData.reservationItems ||
        !Array.isArray(reservationData.reservationItems)
      ) {
        httpRequestsTotal.inc({
          method: "POST",
          route: "/api/marketplace/reservation/create",
          code: 400,
        });
        return NextResponse.json(
          { error: "Les éléments de réservation sont requis" },
          { status: 400, headers: corsHeaders },
        );
      }

      // Vérification des relations
      const [customer, paymentMethod] = await Promise.all([
        prisma.customers.findUnique({
          where: { id: reservationData.customerId },
        }),
        prisma.orderPayment.findUnique({
          where: { id: reservationData.paymentMethodId },
        }),
      ]);

      if (!customer || !paymentMethod) {
        httpRequestsTotal.inc({
          method: "POST",
          route: "/api/marketplace/reservation/create",
          code: 404,
        });
        return NextResponse.json(
          {
            error: `Relations non trouvées: ${
              !customer ? `Client (${reservationData.customerId}) ` : ""
            }${
              !paymentMethod
                ? `Méthode de paiement (${reservationData.paymentMethodId})`
                : ""
            }`.trim(),
          },
          { status: 404, headers: corsHeaders },
        );
      }

      // Vérification des stocks avant création
      for (const item of reservationData.reservationItems) {
        const stock = await prisma.stock.findFirst({
          where: {
            skuPartner: {
              productId: item.productId,
              partnerId: item.partnerId,
            },
            sourceId: item.sourceId,
          },
        });

        if (!stock) {
          httpRequestsTotal.inc({
            method: "POST",
            route: "/api/marketplace/reservation/create",
            code: 404,
          });
          return NextResponse.json(
            {
              error: `Stock non trouvé pour le produit ${item.productId} et partenaire ${item.partnerId}`,
            },
            { status: 404, headers: corsHeaders },
          );
        }

        if (stock.sealable < item.qteReserved) {
          httpRequestsTotal.inc({
            method: "POST",
            route: "/api/marketplace/reservation/create",
            code: 400,
          });
          return NextResponse.json(
            {
              error: `Stock insuffisant pour le produit ${item.productId}. Disponible: ${stock.sealable}, Demandé: ${item.qteReserved}`,
            },
            { status: 400, headers: corsHeaders },
          );
        }
      }

      // Création de la réservation dans une transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Décrémenter les stocks
        for (const item of reservationData.reservationItems) {
          await prisma.stock.updateMany({
            where: {
              skuPartner: {
                productId: item.productId,
                partnerId: item.partnerId,
              },
              sourceId: item.sourceId,
            },
            data: {
              sealable: {
                decrement: item.qteReserved,
              },
            },
          });
        }

        // Créer la réservation
        const {
          customerId,
          paymentMethodId,
          partnerId,
          comment,
          ...reservationDataWithoutIds
        } = reservationData;

        return await prisma.reservation.create({
          data: {
            ...reservationDataWithoutIds,
            comment: comment || "",
            amountTTC: parseFloat(reservationData.amountTTC.toFixed(2)),
            amountOrdered: parseFloat(reservationData.amountOrdered.toFixed(2)),
            shippingAmount: parseFloat(
              reservationData.shippingAmount.toFixed(2),
            ),
            weight: parseFloat(reservationData.weight.toFixed(2)),
            customer: { connect: { id: reservationData.customerId } },
            paymentMethod: { connect: { id: reservationData.paymentMethodId } },
            reservationItems: {
              create: reservationData.reservationItems.map((item: any) => ({
                qteReserved: Number(item.qteReserved),
                price: parseFloat(item.price.toFixed(2)),
                discountedPrice:
                  item.discountedPrice !== undefined
                    ? parseFloat(item.discountedPrice.toFixed(2))
                    : null,
                weight: parseFloat(item.weight.toFixed(2)),
                sku: item.sku,
                tax: item.taxId ? { connect: { id: item.taxId } } : undefined,
                product: { connect: { id: item.productId } },
                source: item.sourceId
                  ? { connect: { id: item.sourceId } }
                  : undefined,
                partner: { connect: { id: item.partnerId } },
              })),
            },
          },
          include: {
            reservationItems: {
              include: {
                product: true,
                source: true,
                partner: true,
              },
            },
            customer: true,
            paymentMethod: true,
          },
        });
      });

      createdReservations.push(result);
    }

    httpRequestsTotal.inc({
      method: "POST",
      route: "/api/marketplace/reservation/create",
      code: 201,
    });
    return NextResponse.json(
      {
        message:
          reservationsData.length > 1
            ? "Réservations créées avec succès"
            : "Réservation créée avec succès",
        data:
          reservationsData.length > 1
            ? createdReservations
            : createdReservations[0],
      },
      { status: 201, headers: corsHeaders },
    );
  } catch (error: any) {
    httpRequestsTotal.inc({
      method: "POST",
      route: "/api/marketplace/reservation/create",
      code: 500,
    });
    console.error("Erreur lors de la création de la réservation:", error);
    return NextResponse.json(
      {
        error: error.message || "Erreur lors de la création de la réservation",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
