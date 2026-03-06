import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WiseClient } from "../wise-client.js";

export function registerQuoteTools(server: McpServer, client: WiseClient) {
  server.tool(
    "create_quote",
    "Create a quote for a money transfer. Specify either sourceAmount OR targetAmount (not both). Returns exchange rate, fees, and delivery estimate.",
    {
      profileId: z.number().describe("Profile ID"),
      sourceCurrency: z.string().describe("Source currency code, e.g. EUR"),
      targetCurrency: z.string().describe("Target currency code, e.g. HUF"),
      sourceAmount: z
        .number()
        .optional()
        .describe("Amount in source currency (provide this OR targetAmount)"),
      targetAmount: z
        .number()
        .optional()
        .describe("Amount in target currency (provide this OR sourceAmount)"),
    },
    { title: "Create Quote", readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    async ({ profileId, sourceCurrency, targetCurrency, sourceAmount, targetAmount }) => {
      const body: Record<string, unknown> = {
        profile: profileId,
        source: sourceCurrency,
        target: targetCurrency,
        rateType: "FIXED",
        type: "BALANCE_PAYOUT",
      };
      if (sourceAmount !== undefined) body.sourceAmount = sourceAmount;
      if (targetAmount !== undefined) body.targetAmount = targetAmount;

      const result = await client.post("/v1/quotes", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_quote",
    "Get an existing quote by ID",
    { quoteId: z.number().describe("Quote ID") },
    { title: "Get Quote", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ quoteId }) => {
      const result = await client.get(`/v1/quotes/${quoteId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_temporary_quote",
    "Get a temporary (non-stored) quote to check rates and fees without creating one",
    {
      sourceCurrency: z.string().describe("Source currency code, e.g. EUR"),
      targetCurrency: z.string().describe("Target currency code, e.g. HUF"),
      sourceAmount: z
        .number()
        .optional()
        .describe("Amount in source currency (provide this OR targetAmount)"),
      targetAmount: z
        .number()
        .optional()
        .describe("Amount in target currency (provide this OR sourceAmount)"),
    },
    { title: "Get Temporary Quote", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ sourceCurrency, targetCurrency, sourceAmount, targetAmount }) => {
      const query: Record<string, string | number | undefined> = {
        source: sourceCurrency,
        target: targetCurrency,
        rateType: "FIXED",
      };
      if (sourceAmount !== undefined) query.sourceAmount = sourceAmount;
      if (targetAmount !== undefined) query.targetAmount = targetAmount;

      const result = await client.get("/v1/quotes", query);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );
}
