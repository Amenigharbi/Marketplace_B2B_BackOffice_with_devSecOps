// app/api/settings-schedule/getAll/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // const session = await auth(); // Check user session

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const schedules = await prisma.settingSchedule.findMany({
      include: {
        setting: true,
      },
    });

    if (schedules.length === 0) {
      return NextResponse.json(
        { message: "No SettingSchedules found", schedules: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "SettingSchedules retrieved successfully", schedules },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching SettingSchedules:", error);
    return NextResponse.json(
      { error: "Failed to retrieve SettingSchedules" },
      { status: 500 },
    );
  }
}
