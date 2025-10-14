// app/api/settings-schedule/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// POST: Create new SettingSchedule
export async function POST(req: Request) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();

    // Validate required fields
    if (!body.day || !body.startTime || !body.endTime || !body.settingId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create the SettingSchedule in the database
    const newSchedule = await prisma.settingSchedule.create({
      data: {
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        settingId: body.settingId,
      },
    });

    return NextResponse.json(
      {
        message: "SettingSchedule created successfully",
        schedule: newSchedule,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating SettingSchedule:", error);
    return NextResponse.json(
      { error: "Failed to create SettingSchedule" },
      { status: 500 },
    );
  }
}
