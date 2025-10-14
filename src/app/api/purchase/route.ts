import { OrderState, PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/services/auth/auth";
import { httpRequestsTotal } from "@/libs/metrics";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      manufacturerId,
      warehouseId,
      deliveryDate,
      totalAmount,
      status,
      comments,
      payments,
      fileReferences,
      products,
    } = await req.json();

    const parsedManufacturerId = Number(manufacturerId);
    const parsedWarehouseId = Number(warehouseId);

    if (isNaN(parsedManufacturerId) || parsedManufacturerId <= 0) {
      httpRequestsTotal.inc({
        method: "POST",
        route: "/api/purchase",
        code: 400,
      });
      return NextResponse.json(
        { error: "Manufacturier invalide" },
        { status: 400 },
      );
    }

    if (isNaN(parsedWarehouseId) || parsedWarehouseId <= 0) {
      httpRequestsTotal.inc({
        method: "POST",
        route: "/api/purchase",
        code: 400,
      });
      return NextResponse.json({ error: "Entrepôt invalide" }, { status: 400 });
    }

    // Création de la commande
    const order = await prisma.purchaseOrder.create({
      data: {
        orderNumber: `PO-${Date.now()}`,
        manufacturer: { connect: { manufacturerId: parsedManufacturerId } },
        warehouse: { connect: { warehouseId: parsedWarehouseId } },
        deliveryDate: new Date(deliveryDate),
        totalAmount: parseFloat(totalAmount),
        status: status as OrderState,
        comments:
          comments?.length > 0
            ? {
                create: comments.map((comment: { content: string }) => ({
                  content: comment.content,
                })),
              }
            : undefined,
        payments:
          payments?.length > 0
            ? {
                create: payments
                  .filter((payment: any) => {
                    const amount = parseFloat(payment.amount);
                    const percentage = parseFloat(payment.percentage);
                    const validMethods = Object.values(PaymentMethod);
                    return (
                      !isNaN(amount) &&
                      amount > 0 &&
                      validMethods.includes(
                        payment.paymentMethod.toUpperCase(),
                      ) &&
                      !isNaN(percentage) &&
                      percentage >= 0 &&
                      percentage <= 100
                    );
                  })
                  .map((payment: any) => ({
                    amount: parseFloat(payment.amount),
                    paymentMethod: payment.paymentMethod.toUpperCase(),
                    percentage: parseFloat(payment.percentage) || 0,
                    manufacturerId: parsedManufacturerId,
                    paymentDate: new Date(payment.date),
                  })),
              }
            : undefined,
        files: {
          create: (Array.isArray(fileReferences) ? fileReferences : []).map(
            (file: { url: string; name: string }) => ({
              url: file.url,
              name: file.name,
            }),
          ),
        },
        products: {
          create: (Array.isArray(products) ? products : []).map(
            (product: any) => ({
              name: product.name,
              quantity: product.quantity,
              priceExclTax: product.priceExclTax,
              total: product.total,
              sku: product.sku, // Added sku based on your frontend data
            }),
          ),
        },
      },
      include: {
        comments: true,
        payments: true,
        files: true,
        products: true,
        manufacturer: { select: { companyName: true } },
      },
    });

    httpRequestsTotal.inc({
      method: "POST",
      route: "/api/purchase",
      code: 201,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    httpRequestsTotal.inc({
      method: "POST",
      route: "/api/purchase",
      code: 500,
    });
    console.error("Erreur création commande:", error);
    return NextResponse.json(
      { error: "Échec de l'enregistrement" },
      { status: 500 },
    );
  }
}
