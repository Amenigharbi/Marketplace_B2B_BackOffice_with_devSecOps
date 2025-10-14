// instrumentation.ts
import { collectDefaultMetrics } from "prom-client";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { register } = await import("prom-client");
    collectDefaultMetrics();

    console.log("Prometheus metrics collector initialized");
  }
}
