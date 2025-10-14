import { Writable } from "stream";
import { NextResponse } from "next/server";
import { logError } from "@/utils/logError";
import { typesense } from "@/clients/typesense";
import { indexingOrders } from "./indexingOrders";
import { readingOrdersStream } from "./readingOrdersStream";

export const startIndexingStream = async () => {
  console.info("Syncing started");
  try {
    const isOrdersCollectionExist = await typesense.isCollectionExist("orders");

    if (!isOrdersCollectionExist) {
      await typesense.orders.createCollection();
    }

    const readableStream = readingOrdersStream();
    const writableStream = new Writable({
      write(chunk: any, encoding: any, callback: any) {
        const magentoOrders = JSON.parse(chunk.toString());
        indexingOrders(magentoOrders, callback);
      },
    });

    readableStream.on("error", (error: any) => {
      process.env.NODE_ENV === "development" &&
        console.error("Stream error:", error);
    });

    writableStream.on("error", (error: any) => {
      process.env.NODE_ENV === "development" &&
        console.error("Writable stream error:", error);
    });

    readableStream.pipe(writableStream);

    return NextResponse.json("Orders Syncing ...", { status: 202 });
  } catch (err) {
    logError(err);
  }
};
