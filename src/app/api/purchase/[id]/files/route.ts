// app/api/purchase/[id]/files/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { files } = await req.json();

    if (!files || !files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Mise à jour de la commande avec les fichiers
    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        files: {
          create: files.map((file: any) => ({
            url: file.url,
            name: file.name,
          })),
        },
      },
      include: {
        files: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order files:", error);
    return NextResponse.json(
      { error: "Failed to update order files" },
      { status: 500 },
    );
  }
}
