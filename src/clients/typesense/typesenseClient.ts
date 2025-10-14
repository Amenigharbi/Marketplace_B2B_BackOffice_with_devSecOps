import typesense from "typesense";

export const typesenseClient = new typesense.Client({
  nodes: [
    {
      host: String(process.env.TYPESENSE_HOST),
      port: Number(process.env.TYPESENSE_PORT),
      protocol: String(process.env.TYPESENSE_PROTOCOL),
    },
  ],
  apiKey: String(process.env.TYPESENSE_KEY),
  connectionTimeoutSeconds: 60,
});
