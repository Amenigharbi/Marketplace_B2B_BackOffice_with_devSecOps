import { NextResponse } from "next/server";
import { OrderState, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = (searchParams.get("search") || "").toLowerCase();
    const status = (searchParams.get("status") as OrderState) || undefined;
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("pageSize") || "10");

    const where: any = {
      OR: [
        {
          orderNumber: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            companyName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          warehouse: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    };

    if (status) where.status = status;
    if (searchParams.get("paymentMethod")) {
      where.payments = {
        some: { paymentMethod: searchParams.get("paymentMethod") },
      };
    }
    if (searchParams.get("deliveryDateStart")) {
      where.deliveryDate = {
        gte: new Date(searchParams.get("deliveryDateStart")!),
      };
    }
    if (searchParams.get("deliveryDateEnd")) {
      where.deliveryDate.lte = new Date(searchParams.get("deliveryDateEnd")!);
    }

    const [data, total] = await prisma.$transaction([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          manufacturer: true,
          warehouse: { select: { name: true } },
          payments: {
            select: {
              id: true,
              amount: true,
              paymentMethod: true,
              percentage: true,
              manufacturerId: true,
              purchaseOrderId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return NextResponse.json({
      data,
      total,
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch purchases",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
