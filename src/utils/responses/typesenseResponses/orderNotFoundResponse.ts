import { NextResponse } from "next/server";

export const orderNotFoundResponse = (message: string) => {
  const parts = message.split("with id:");

  const id = parts[1].trim();

  return NextResponse.json(
    {
      error: "Order not found.",
      orderId: id,
    },
    {
      status: 404,
    },
  );
};
