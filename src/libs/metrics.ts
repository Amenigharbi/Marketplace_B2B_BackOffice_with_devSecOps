// src/libs/metrics.ts
import { Counter, Histogram, Gauge, collectDefaultMetrics } from "prom-client";

// Créer un registre personnalisé
import { Registry } from "prom-client";
const register = new Registry();
collectDefaultMetrics({ register });

export const httpRequestDurationMicroseconds = new Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 500],
  registers: [register],
});

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "code"],
  registers: [register],
});

export const userLoginsTotal = new Counter({
  name: "user_logins_total",
  help: "Total number of user logins (success and fail)",
  labelNames: ["result"],
  registers: [register],
});

export const orderProcessingDuration = new Histogram({
  name: "order_processing_duration_seconds",
  help: "Duration of order processing in seconds",
  labelNames: ["route"],
  buckets: [0.1, 1, 5, 15, 60, 300], // 100ms, 1s, 5s, 15s, 1min, 5min
  registers: [register],
});

export const productStockGauge = new Gauge({
  name: "product_stock_quantity",
  help: "Stock réel par produit et source",
  labelNames: ["product_id", "source_id"],
  registers: [register],
});

export const stockOperationTotal = new Counter({
  name: "stock_operation_total",
  help: "Nombre total d'opérations sur le stock",
  labelNames: ["operation", "result", "route", "product_id", "source_id"],
  registers: [register],
});

export const stockUpdateDuration = new Histogram({
  name: "stock_update_duration_seconds",
  help: "Durée des mises à jour de stock en secondes",
  labelNames: ["route", "product_id", "source_id", "result"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export function getMetrics() {
  return register.metrics();
}
