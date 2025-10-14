import { JsonValue } from "@prisma/client/runtime/library";

export interface LogContext {
  userId?: string;
  username?: string;
  storeId?: string;
  [key: string]: any;
}

export interface Log {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  context: JsonValue | null;
  dataBefore: JsonValue | null;
  dataAfter: JsonValue | null;
}
export type LogType = "info" | "error" | "warning" | "order" | "milk run";

export interface LogCreateInput {
  type: string;
  message: string;
  context: JsonValue | null;
  timestamp: Date;
  dataBefore?: JsonValue | null;
  dataAfter?: JsonValue | null;
}
