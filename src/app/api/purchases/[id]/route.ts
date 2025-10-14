import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/services/auth/auth";
import { httpRequestsTotal } from "@/libs/metrics";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const orderId = params.id;
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      httpRequestsTotal.inc({
        method: "PUT",
        route: "/api/purchases/[id]",
        code: 400,
      });
      return NextResponse.json(
        { error: "Données de mise à jour manquantes" },
        { status: 400 },
      );
    }

    // Préparation des données de mise à jour de la commande
    const updateData: any = {
      deliveryDate: body.deliveryDate,
      totalAmount: body.totalAmount,
      status: body.status,
    };

    // Gestion des commentaires
    if (body.comment) {
      updateData.comments = {
        deleteMany: {},
        create: { content: body.comment },
      };
    }

    // Gestion de l'entrepôt
    if (body.warehouseId) {
      updateData.warehouse = { connect: { warehouseId: body.warehouseId } };
    }

    // Gestion du fournisseur
    if (body.supplierId) {
      updateData.manufacturer = {
        connect: { manufacturerId: body.supplierId },
      };
    }

    // Gestion des fichiers
    if (body.files) {
      await prisma.file.deleteMany({
        where: { orderId: orderId },
      });

      if (body.files.length > 0) {
        await prisma.file.createMany({
          data: body.files.map((file: any) => ({
            name: file.name,
            url: file.url,
            orderId: orderId,
          })),
        });
      }
    }

    // Mise à jour de la commande principale
    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id: orderId },
      data: updateData,
      include: {
        manufacturer: true,
        warehouse: true,
        payments: true,
        comments: true,
        files: true,
      },
    });

    // Gestion des produits - APPROCHE AMÉLIORÉE
    if (body.products) {
      // 1. Supprimer tous les produits existants de la commande
      await prisma.productOrdered.deleteMany({
        where: { purchaseOrderId: orderId },
      });

      // 2. Recréer les produits avec les nouvelles données
      if (body.products.length > 0) {
        await prisma.productOrdered.createMany({
          data: body.products.map((product: any) => ({
            name: product.name,
            quantity: product.quantity,
            priceExclTax: product.priceExclTax,
            total: product.quantity * product.priceExclTax,
            purchaseOrderId: orderId,
            sku: product.sku,
          })),
        });
      }
    }

    // Gestion des paiements
    if (body.paymentTypes) {
      await prisma.payment.deleteMany({
        where: { purchaseOrderId: orderId },
      });

      await prisma.payment.createMany({
        data: body.paymentTypes.map((payment: any) => ({
          paymentMethod: payment.type,
          percentage: payment.percentage,
          amount: payment.amount,
          paymentDate: new Date(payment.paymentDate),
          purchaseOrderId: orderId,
          manufacturerId: body.supplierId,
        })),
      });
    }

    // Récupérer la commande mise à jour avec toutes les relations
    const finalOrder = await prisma.purchaseOrder.findUnique({
      where: { id: orderId },
      include: {
        manufacturer: true,
        warehouse: true,
        payments: true,
        comments: true,
        files: true,
        products: true,
      },
    });

    // Supprimer toute la logique de notification
    httpRequestsTotal.inc({
      method: "PUT",
      route: "/api/purchases/[id]",
      code: 200,
    });
    return NextResponse.json(
      {
        message: "Purchase order updated",
        purchaseOrder: finalOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    httpRequestsTotal.inc({
      method: "PUT",
      route: "/api/purchases/[id]",
      code: 500,
    });
    return NextResponse.json(
      { error: "Échec de la mise à jour de la commande" },
      { status: 500 },
    );
  }
}
