import { createUser } from "@/services/users/createUser";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const newUser = await request.json();
    const user = await createUser(newUser);
    if (!user) {
      return NextResponse.json(
        {
          message: "User already Exist",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      {
        message: "User created Successfully",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 },
    );
  }
};
