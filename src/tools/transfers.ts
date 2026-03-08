import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WiseClient } from "../wise-client.js";


export function registerTransferTools(server: McpServer, client: WiseClient) {
  server.tool(
    "list_transfers",
    "List transfers for a profile with optional filters",
    {
      profileId: z.number().describe("Profile ID"),
      status: z
        .string()
        .optional()
        .describe("Filter by status: incoming_payment_waiting, processing, funds_converted, outgoing_payment_sent, cancelled, etc."),
      createdDateStart: z
        .string()
        .optional()
        .describe("Filter start date, ISO format e.g. 2024-01-01T00:00:00.000Z"),
      createdDateEnd: z
        .string()
        .optional()
        .describe("Filter end date, ISO format"),
      limit: z.number().default(10).describe("Results per page (default 10)"),
      offset: z.number().default(0).describe("Pagination offset"),
    },
    { title: "List Transfers", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ profileId, status, createdDateStart, createdDateEnd, limit, offset }) => {
      const query: Record<string, string | number | undefined> = {
        profile: profileId,
        limit,
        offset,
      };
      if (status) query.status = status;
      if (createdDateStart) query.createdDateStart = createdDateStart;
      if (createdDateEnd) query.createdDateEnd = createdDateEnd;

      const result = await client.get("/v1/transfers", query);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_transfer",
    "Get a specific transfer by ID",
    { transferId: z.number().describe("Transfer ID") },
    { title: "Get Transfer", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ transferId }) => {
      const result = await client.get(`/v1/transfers/${transferId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "create_transfer",
    "Create a new transfer. Requires a quote ID and recipient account ID. The customerTransactionId ensures idempotency — reuse the same value when retrying a failed request to avoid duplicate transfers. NOTE: In EU/UK, funding from balance via personal token is restricted by PSD2.",
    {
      targetAccount: z.number().describe("Recipient account ID"),
      quoteId: z.number().describe("Quote ID (create a quote first)"),
      customerTransactionId: z.string().uuid().describe("Unique UUID for idempotency. Reuse the same value when retrying to prevent duplicate transfers."),
      reference: z.string().optional().describe("Payment reference visible to recipient"),
    },
    { title: "Create Transfer", readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async ({ targetAccount, quoteId, customerTransactionId, reference }) => {
      const body: Record<string, unknown> = {
        targetAccount,
        quote: quoteId,
        customerTransactionId,
      };
      if (reference) {
        body.details = { reference };
      }
      const result = await client.post("/v1/transfers", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "fund_transfer",
    "Fund a transfer from your Wise balance. NOTE: This may NOT work with personal tokens in EU/UK due to PSD2 regulations.",
    {
      profileId: z.number().describe("Profile ID"),
      transferId: z.number().describe("Transfer ID"),
    },
    { title: "Fund Transfer", readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    async ({ profileId, transferId }) => {
      const result = await client.post(
        `/v3/profiles/${profileId}/transfers/${transferId}/payments`,
        { type: "BALANCE" },
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "cancel_transfer",
    "Cancel a transfer (only possible if not yet completed)",
    { transferId: z.number().describe("Transfer ID") },
    { title: "Cancel Transfer", readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async ({ transferId }) => {
      const result = await client.put(`/v1/transfers/${transferId}/cancel`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_delivery_estimate",
    "Get the estimated delivery date for a transfer",
    { transferId: z.number().describe("Transfer ID") },
    { title: "Get Delivery Estimate", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ transferId }) => {
      const result = await client.get(`/v1/delivery-estimates/${transferId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );
}
