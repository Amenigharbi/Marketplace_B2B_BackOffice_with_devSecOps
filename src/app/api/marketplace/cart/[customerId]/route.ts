import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/utils/cors";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET - Récupérer le panier avec toutes les relations
export async function GET(
  req: Request,
  { params }: { params: { customerId: string } },
) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { customerId: params.customerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                weight: true,
                sku: true,
                tax: true,
                productType: true,
              },
            },
            partner: { select: { username: true, minimumAmount: true } },
            source: true,
          },
        },
      },
    });

    return NextResponse.json(cart || { items: [] }, { headers: corsHeaders });
  } catch (error) {
    console.error("GET Cart Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// POST - Créer ou remplacer complètement le panier
export async function POST(
  req: Request,
  { params }: { params: { customerId: string } },
) {
  try {
    const { items } = await req.json();

    // Validation de base
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400, headers: corsHeaders },
      );
    }

    const cartData = {
      customerId: params.customerId,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          partnerId: item.partnerId,
          sourceId: item.sourceId,
          weight: item.weight,
          productName: item.productName || item.name,
          partnerName: item.partnerName,
          partnerMinimumAmount: item.partnerMinimumAmount,
          productType: item.productType,
          sourceName: item.sourceName,
          stock: item.stock,
          image: item.image,
          sku: item.sku,
          taxRate: item.tax?.value,
          minQty: item.minQty,
          maxQty: item.maxQty,
        })),
      },
    };

    const cart = await prisma.cart.upsert({
      where: { customerId: params.customerId },
      update: {
        items: {
          deleteMany: {},
          create: cartData.items.create,
        },
      },
      create: cartData,
      include: { items: true },
    });

    return NextResponse.json(cart, { headers: corsHeaders });
  } catch (error) {
    console.error("POST Cart Error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// PUT - Mise à jour partielle du panier
export async function PUT(
  req: Request,
  { params }: { params: { customerId: string } },
) {
  try {
    const { items } = await req.json();

    const existingCart = await prisma.cart.findUnique({
      where: { customerId: params.customerId },
      include: { items: true },
    });

    if (!existingCart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Fusionner les items
    const updatedItems = existingCart.items.map((existingItem) => {
      const updatedItem = items.find(
        (item: {
          productId: string;
          partnerId: string;
          sourceId: string | null;
        }) =>
          item.productId === existingItem.productId &&
          item.partnerId === existingItem.partnerId &&
          item.sourceId === existingItem.sourceId,
      );
      return updatedItem
        ? {
            ...existingItem,
            quantity: updatedItem.quantity ?? existingItem.quantity,
            price: updatedItem.price ?? existingItem.price,
            weight: updatedItem.weight ?? existingItem.weight,
          }
        : existingItem;
    });

    // Ajouter nouveaux items
    const newItems = items.filter(
      (item: {
        productId: string;
        partnerId: string;
        sourceId: string | null;
      }) =>
        !existingCart.items.some(
          (ei) =>
            ei.productId === item.productId &&
            ei.partnerId === item.partnerId &&
            ei.sourceId === item.sourceId,
        ),
    );

    const fullUpdate = [...updatedItems, ...newItems].map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      partnerId: item.partnerId,
      sourceId: item.sourceId,
      weight: item.weight,
      productName: item.productName || item.name,
      partnerName: item.partnerName,
      partnerMinimumAmount: item.partnerMinimumAmount,
      productType: item.productType,
      sourceName: item.sourceName,
      stock: item.stock,
      image: item.image,
      sku: item.sku,
      taxRate: item.taxRate ?? item.tax?.value,
      minQty: item.minQty,
      maxQty: item.maxQty,
    }));

    const updatedCart = await prisma.cart.update({
      where: { customerId: params.customerId },
      data: {
        items: {
          deleteMany: {},
          create: fullUpdate,
        },
      },
      include: { items: true },
    });

    return NextResponse.json(updatedCart, { headers: corsHeaders });
  } catch (error) {
    console.error("PUT Cart Error:", error);
    return NextResponse.json(
      { error: "Failed to partially update cart" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// DELETE - Supprimer le panier
export async function DELETE(
  req: Request,
  { params }: { params: { customerId: string } },
) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    await prisma.cart.delete({
      where: { customerId },
    });

    return NextResponse.json(
      { message: "Cart deleted successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("DELETE Cart Error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500, headers: corsHeaders },
    );
  }
}
