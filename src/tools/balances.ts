import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WiseClient } from "../wise-client.js";

export function registerBalanceTools(server: McpServer, client: WiseClient) {
  server.tool(
    "list_balances",
    "List all balance accounts for a profile. Returns currency balances with available amounts. Types: STANDARD (one per currency) or SAVINGS (jars, multiple per currency).",
    {
      profileId: z.number().describe("Profile ID"),
      types: z
        .string()
        .default("STANDARD")
        .describe("Comma-separated balance types: STANDARD, SAVINGS"),
    },
    async ({ profileId, types }) => {
      const result = await client.get(`/v4/profiles/${profileId}/balances`, { types });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_balance",
    "Get a specific balance account by ID",
    {
      profileId: z.number().describe("Profile ID"),
      balanceId: z.number().describe("Balance ID"),
    },
    async ({ profileId, balanceId }) => {
      const result = await client.get(`/v4/profiles/${profileId}/balances/${balanceId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );
}
