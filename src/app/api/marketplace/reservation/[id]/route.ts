import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";
import { corsHeaders } from "@/utils/cors";
import { httpRequestsTotal } from "@/libs/metrics";

const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 30000,
    timeout: 30000,
  },
});

// Handler for OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
// 🟢 GET: Retrieve a reservation by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // let user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // if (!user.mRoleId) {
    //   return NextResponse.json({ message: "No role found" }, { status: 403 });
    // }

    // // Get user's role to check if they're KamiounAdminMaster
    // const userRole = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    // });

    // // If user is KamiounAdminMaster, allow access
    // if (userRole?.name === "KamiounAdminMaster") {
    //   const { id } = params;
    //   const reservation = await prisma.reservation.findUnique({
    //     where: { id },
    //     include: {
    //       customer: true,
    //       agent: true,
    //       partner: true,
    //       order: true,
    //       paymentMethod: true,
    //       reservationItems: true,
    //     },
    //   });

    //   if (!reservation) {
    //     return NextResponse.json(
    //       { message: "Reservation not found" },
    //       { status: 404 },
    //     );
    //   }

    //   return NextResponse.json(
    //     { message: "Reservation retrieved successfully", reservation },
    //     { status: 200 },
    //   );
    // }

    // // For non-KamiounAdminMaster users, check permissions
    // const rolePermissions = await prisma.rolePermission.findMany({
    //   where: {
    //     roleId: user.mRoleId,
    //   },
    //   include: {
    //     permission: true,
    //   },
    // });

    // const canRead = rolePermissions.some(
    //   (rp) =>
    //     rp.permission?.resource === "Reservation" &&
    //     rp.actions.includes("read"),
    // );

    // if (!canRead) {
    //   return NextResponse.json(
    //     { message: "Forbidden: missing 'read' permission for Reservation" },
    //     { status: 403 },
    //   );
    // }

    const { id } = params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        customer: true,
        order: true,
        paymentMethod: true,
        reservationItems: true,
      },
    });

    if (!reservation) {
      httpRequestsTotal.inc({
        method: "GET",
        route: "/api/marketplace/reservation/[id]",
        code: 404,
      });
      return NextResponse.json(
        { message: "Reservation not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    httpRequestsTotal.inc({
      method: "GET",
      route: "/api/marketplace/reservation/[id]",
      code: 200,
    });
    return NextResponse.json(
      { message: "Reservation retrieved successfully", reservation },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error("Error fetching reservation:", error);
    httpRequestsTotal.inc({
      method: "GET",
      route: "/api/marketplace/reservation/[id]",
      code: 500,
    });
    return NextResponse.json(
      { error: "Failed to retrieve reservation" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { deliveryDates, comment, ...reservationData } = body;

    // Mise à jour des dates de livraison si elles existent
    if (Array.isArray(deliveryDates) && deliveryDates.length > 0) {
      await Promise.all(
        deliveryDates.map(async ({ partnerId, deliveryDate }) => {
          if (!partnerId || !deliveryDate) return;

          await prisma.reservationItem.updateMany({
            where: {
              reservationId: id,
              partnerId: partnerId,
            },
            data: {
              deliveryDate: new Date(deliveryDate),
            },
          });
        }),
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        reservationItems: {
          include: {
            source: true,
            product: true,
            partner: true,
          },
        },
        customer: true,
        paymentMethod: true,
      },
    });

    if (!reservation) {
      httpRequestsTotal.inc({
        method: "PATCH",
        route: "/api/marketplace/reservation/[id]",
        code: 404,
      });
      return NextResponse.json(
        { message: "Réservation introuvable" },
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }
    if (reservationData.isActive === false) {
      return NextResponse.json(
        {
          error: {
            message: "Unable to deactivate an active reservation",
            code: "ACTIVE_RESERVATION_MODIFICATION",
          },
        },
        { status: 400 },
      );
    }

    const isActivating =
      reservationData.isActive === true && reservation.isActive === false;

    return await prisma.$transaction(async (tx) => {
      // Préparation des données de mise à jour
      const updateData = {
        ...(comment !== undefined && { comment }),
      };

      if (isActivating) {
        // 1. Création ou récupération de l'état/statut
        const stateName = "new";
        let state = await tx.state.findUnique({ where: { name: stateName } });
        if (!state)
          state = await tx.state.create({ data: { name: stateName } });

        let status = await tx.status.findUnique({
          where: { name: "open", stateId: state.id },
        });
        if (!status) {
          status = await tx.status.create({
            data: { name: "open", stateId: state.id },
          });
        }

        // 2. Préparation des données des articles de commande
        const orderItemsData = reservation.reservationItems.map((item) => {
          const deliveryDateForItem = deliveryDates?.find(
            (dd: { partnerId: string | null }) =>
              dd.partnerId === item.partnerId,
          )?.deliveryDate;

          const finalDeliveryDate = deliveryDateForItem
            ? new Date(deliveryDateForItem)
            : item.deliveryDate
            ? new Date(item.deliveryDate)
            : null;

          return {
            qteOrdered: item.qteReserved,
            qteRefunded: 0,
            qteShipped: 0,
            qteCanceled: 0,
            discountedPrice: item.discountedPrice,
            weight: item.weight,
            sku: item.sku,
            deliveryDate: finalDeliveryDate,
            product: { connect: { id: item.productId } },
            source: item.sourceId
              ? { connect: { id: item.sourceId } }
              : undefined,
            partner: item.partnerId
              ? { connect: { id: item.partnerId } }
              : undefined,
          };
        });

        // 3. Création de la commande
        const order = await tx.order.create({
          data: {
            amountTTC: Number(reservation.amountTTC.toFixed(3)),
            amountRefunded: 0,
            amountCanceled: 0,
            amountOrdered: Number(reservation.amountOrdered.toFixed(3)),
            amountShipped: 0,
            shippingMethod: reservation.shippingMethod,
            shippingAmount: Number(reservation.shippingAmount.toFixed(3)),
            fromMobile: reservation.fromMobile,
            weight: reservation.weight,
            isActive: true,
            comment: comment || reservation.comment || null,
            status: { connect: { id: status.id } },
            state: { connect: { id: state.id } },
            paymentMethod: { connect: { id: reservation.paymentMethodId } },
            customer: { connect: { id: reservation.customerId } },
            reservation: { connect: { id: reservation.id } },
            orderItems: { create: orderItemsData },
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

        // 4. Mise à jour finale de la réservation
        const updatedReservation = await tx.reservation.update({
          where: { id },
          data: {
            isActive: true,
            ...updateData,
          },
        });

        httpRequestsTotal.inc({
          method: "PATCH",
          route: "/api/marketplace/reservation/[id]",
          code: 200,
        });
        return NextResponse.json(
          {
            message: "Réservation activée et commande créée avec succès.",
            reservation: updatedReservation,
            order,
          },
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      } else {
        // Cas d'une simple mise à jour
        const {
          id: _,
          createdAt,
          customer,
          paymentMethod,
          reservationItems,
          ...otherData
        } = reservationData;

        const updatedReservation = await tx.reservation.update({
          where: { id },
          data: {
            ...otherData,
            ...updateData,
          },
        });

        httpRequestsTotal.inc({
          method: "PATCH",
          route: "/api/marketplace/reservation/[id]",
          code: 200,
        });
        return NextResponse.json(
          {
            message: "Réservation mise à jour avec succès.",
            reservation: updatedReservation,
          },
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation :", error);
    httpRequestsTotal.inc({
      method: "PATCH",
      route: "/api/marketplace/reservation/[id]",
      code: 500,
    });

    return NextResponse.json(
      {
        error: {
          message: "Une erreur inattendue est survenue.",
          code: "INTERNAL_SERVER_ERROR",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // let user = session.user as {
    //   id: string;
    //   roleId: string;
    //   mRoleId: string;
    //   username: string;
    //   firstName: string;
    //   lastName: string;
    //   isActive: boolean;
    // };

    // if (!user.mRoleId) {
    //   return NextResponse.json({ message: "No role found" }, { status: 403 });
    // }

    // // Get user's role to check if they're KamiounAdminMaster
    // const userRole = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    // });

    // // If user is not KamiounAdminMaster, check permissions
    // if (userRole?.name !== "KamiounAdminMaster") {
    //   const rolePermissions = await prisma.rolePermission.findMany({
    //     where: {
    //       roleId: user.mRoleId,
    //     },
    //     include: {
    //       permission: true,
    //     },
    //   });

    //   const canDelete = rolePermissions.some(
    //     (rp) =>
    //       rp.permission?.resource === "Reservation" &&
    //       rp.actions.includes("delete"),
    //   );

    //   if (!canDelete) {
    //     return NextResponse.json(
    //       { message: "Forbidden: missing 'delete' permission for Reservation" },
    //       { status: 403 },
    //     );
    //   }
    // }

    const { id } = params;
    await prisma.reservationItem.deleteMany({
      where: { reservationId: id },
    });
    await prisma.reservation.delete({ where: { id } });

    httpRequestsTotal.inc({
      method: "DELETE",
      route: "/api/marketplace/reservation/[id]",
      code: 200,
    });
    return NextResponse.json(
      { message: "Reservation deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting reservation:", error);
    httpRequestsTotal.inc({
      method: "DELETE",
      route: "/api/marketplace/reservation/[id]",
      code: 500,
    });
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 },
    );
  }
}
