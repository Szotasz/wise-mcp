import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WiseClient } from "../wise-client.js";

export function registerRecipientTools(server: McpServer, client: WiseClient) {
  server.tool(
    "list_recipients",
    "List all recipient accounts for a profile, optionally filtered by currency",
    {
      profileId: z.number().describe("Profile ID"),
      currency: z.string().optional().describe("Filter by currency code, e.g. HUF"),
    },
    async ({ profileId, currency }) => {
      const query: Record<string, string | number | undefined> = { profile: profileId };
      if (currency) query.currency = currency;
      const result = await client.get("/v1/accounts", query);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_recipient",
    "Get a specific recipient account by ID",
    { accountId: z.number().describe("Recipient account ID") },
    async ({ accountId }) => {
      const result = await client.get(`/v1/accounts/${accountId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "create_recipient",
    "Create a new recipient account. The 'details' object varies by currency/type. Use get_account_requirements first to know which fields are needed.",
    {
      profileId: z.number().describe("Profile ID"),
      currency: z.string().describe("Currency code, e.g. HUF"),
      type: z
        .string()
        .describe("Recipient type, e.g. iban, sort_code, aba, email, hungarian"),
      accountHolderName: z.string().describe("Full name of the recipient"),
      details: z
        .record(z.unknown())
        .describe("Currency-specific bank details object (use get_account_requirements to know the fields)"),
      ownedByCustomer: z
        .boolean()
        .optional()
        .describe("Whether this account belongs to you"),
    },
    async ({ profileId, currency, type, accountHolderName, details, ownedByCustomer }) => {
      const body: Record<string, unknown> = {
        profile: profileId,
        currency,
        type,
        accountHolderName,
        details,
      };
      if (ownedByCustomer !== undefined) body.ownedByCustomer = ownedByCustomer;
      const result = await client.post("/v1/accounts", body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "delete_recipient",
    "Delete (deactivate) a recipient account",
    { accountId: z.number().describe("Recipient account ID") },
    async ({ accountId }) => {
      await client.delete(`/v1/accounts/${accountId}`);
      return { content: [{ type: "text", text: `Recipient ${accountId} deleted successfully.` }] };
    },
  );

  server.tool(
    "get_account_requirements",
    "Get the required fields for creating a recipient in a specific currency route. Returns field definitions with validation rules.",
    {
      source: z.string().describe("Source currency code, e.g. EUR"),
      target: z.string().describe("Target currency code, e.g. HUF"),
      sourceAmount: z.number().describe("Amount in source currency"),
    },
    async ({ source, target, sourceAmount }) => {
      const result = await client.get("/v1/account-requirements", {
        source,
        target,
        sourceAmount,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );
}
