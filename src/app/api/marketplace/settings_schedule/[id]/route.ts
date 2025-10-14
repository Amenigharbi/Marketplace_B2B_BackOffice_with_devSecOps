// app/api/settings-schedule/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../services/auth";

const prisma = new PrismaClient();

// GET: Retrieve single SettingSchedule by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    const schedule = await prisma.settingSchedule.findUnique({
      where: { id },
      include: {
        setting: true,
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { message: "SettingSchedule not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "SettingSchedule retrieved successfully", schedule },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching SettingSchedule:", error);
    return NextResponse.json(
      { error: "Failed to retrieve SettingSchedule" },
      { status: 500 },
    );
  }
}

// PATCH: Update SettingSchedule
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;
    const body = await req.json();

    const updatedSchedule = await prisma.settingSchedule.update({
      where: { id },
      data: {
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        settingId: body.settingId,
      },
    });

    return NextResponse.json(
      {
        message: "SettingSchedule updated successfully",
        schedule: updatedSchedule,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating SettingSchedule:", error);
    return NextResponse.json(
      { error: "Failed to update SettingSchedule" },
      { status: 500 },
    );
  }
}

// DELETE: Remove SettingSchedule
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await auth();

    // if (!session?.user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    await prisma.settingSchedule.delete({ where: { id } });

    return NextResponse.json(
      { message: "SettingSchedule deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting SettingSchedule:", error);
    return NextResponse.json(
      { error: "Failed to delete SettingSchedule" },
      { status: 500 },
    );
  }
}
