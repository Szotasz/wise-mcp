import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WiseClient } from "../wise-client.js";

export function registerRateTools(server: McpServer, client: WiseClient) {
  server.tool(
    "get_exchange_rate",
    "Get the current exchange rate between two currencies",
    {
      source: z.string().describe("Source currency code, e.g. EUR"),
      target: z.string().describe("Target currency code, e.g. HUF"),
    },
    { title: "Get Exchange Rate", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ source, target }) => {
      const result = await client.get("/v1/rates", { source, target });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_exchange_rate_history",
    "Get historical exchange rates between two currencies over a time period",
    {
      source: z.string().describe("Source currency code, e.g. EUR"),
      target: z.string().describe("Target currency code, e.g. HUF"),
      from: z.string().describe("Period start, ISO timestamp e.g. 2024-01-01T00:00:00Z"),
      to: z.string().describe("Period end, ISO timestamp e.g. 2024-01-31T23:59:59Z"),
      group: z
        .enum(["day", "hour", "minute"])
        .default("day")
        .describe("Interval grouping: day, hour, or minute"),
    },
    { title: "Get Exchange Rate History", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ source, target, from, to, group }) => {
      const result = await client.get("/v1/rates", { source, target, from, to, group });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );
}
