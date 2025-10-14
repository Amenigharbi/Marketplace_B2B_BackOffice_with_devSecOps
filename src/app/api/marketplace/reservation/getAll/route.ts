import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
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

    // // Get user's role to check permissions
    // const userRole = await prisma.role.findUnique({
    //   where: { id: user.mRoleId },
    //   include: {
    //     permissions: {
    //       include: {
    //         permission: true,
    //       },
    //     },
    //   },
    // });

    // if (!userRole) {
    //   return NextResponse.json({ message: "Role not found" }, { status: 403 });
    // }

    // // Check if user has permission to view reservations
    // const hasPermission = userRole.permissions.some(
    //   (rp) => rp.permission.resource === "Reservation",
    // );

    // if (!hasPermission && userRole.name !== "KamiounAdminMaster") {
    //   return NextResponse.json(
    //     { message: "Permission denied" },
    //     { status: 403 },
    //   );
    // }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const searchTerm = url.searchParams.get("search");
    const sort = url.searchParams.get("sort") || "-createdAt";
    const skip = (page - 1) * limit;
    const take = limit;
    const orderBy = sort.startsWith("-")
      ? { [sort.substring(1)]: "desc" }
      : { [sort]: "asc" };
    let reservations;
    if (searchTerm) {
      if (ObjectId.isValid(searchTerm)) {
        reservations = await prisma.reservation.findMany({
          where: { id: searchTerm },
          include: {
            customer: true,
            order: true,
            paymentMethod: true,
            reservationItems: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
                source: {
                  select: {
                    name: true,
                  },
                },
                partner: true,
              },
            },
          },
          orderBy,
        });
      } else {
        reservations = await prisma.reservation.findMany({
          skip: skip,
          take: take,
          include: {
            customer: true,
            order: true,
            paymentMethod: true,
            reservationItems: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },

                source: {
                  select: {
                    name: true,
                  },
                },
                partner: true,
              },
            },
          },
          orderBy,
        });
      }
    } else {
      reservations = await prisma.reservation.findMany({
        skip: skip,
        take: take,
        include: {
          customer: true,
          order: true,
          paymentMethod: true,
          reservationItems: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
              source: {
                select: {
                  name: true,
                },
              },
              partner: true,
            },
          },
        },
        orderBy,
      });
    }

    const totalCount = await prisma.reservation.count();

    return NextResponse.json(
      {
        message: "Reservations retrieved",
        reservations,
        totalReservations: totalCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reservations" },
      { status: 500 },
    );
  }
}
