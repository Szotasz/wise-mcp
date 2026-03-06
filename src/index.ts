import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WiseClient } from "./wise-client.js";
import { registerProfileTools } from "./tools/profiles.js";
import { registerBalanceTools } from "./tools/balances.js";
import { registerRateTools } from "./tools/rates.js";
import { registerQuoteTools } from "./tools/quotes.js";
import { registerRecipientTools } from "./tools/recipients.js";
import { registerTransferTools } from "./tools/transfers.js";

export const configSchema = z.object({
  WISE_API_TOKEN: z.string().describe("Wise Personal API token (get it from wise.com/settings/api-tokens)"),
});

type SmitheryConfig = z.infer<typeof configSchema>;

function getToken(config?: Partial<SmitheryConfig>): string {
  const token = config?.WISE_API_TOKEN || process.env.WISE_API_TOKEN;
  if (!token) throw new Error("Missing required config: WISE_API_TOKEN");
  return token;
}

export default function createServer({ config }: { config: Partial<SmitheryConfig> }) {
  const server = new McpServer({
    name: "wise",
    version: "1.0.0",
    description: "MCP server for the Wise (TransferWise) API. Check balances, exchange rates, recipients, transfers, and quotes.",
    websiteUrl: "https://github.com/Szotasz/wise-mcp",
  });

  const client = new WiseClient(getToken(config));

  registerProfileTools(server, client);
  registerBalanceTools(server, client);
  registerRateTools(server, client);
  registerQuoteTools(server, client);
  registerRecipientTools(server, client);
  registerTransferTools(server, client);

  server.prompt(
    "check-balance",
    "Check your Wise account balances",
    {},
    () => ({
      messages: [{
        role: "user" as const,
        content: {
          type: "text" as const,
          text: "List my Wise profiles using list_profiles, then for each profile show all balances using list_balances. Display the results in a clear table with currency and amount.",
        },
      }],
    })
  );

  server.prompt(
    "check-rate",
    "Check exchange rate between two currencies",
    {
      source: z.string().describe("Source currency code, e.g. EUR"),
      target: z.string().describe("Target currency code, e.g. HUF"),
    },
    ({ source, target }) => ({
      messages: [{
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `Get the current exchange rate from ${source} to ${target} using get_exchange_rate. Show the rate clearly.`,
        },
      }],
    })
  );

  server.prompt(
    "recent-transfers",
    "Show recent transfers",
    {
      profileId: z.string().describe("Profile ID"),
    },
    ({ profileId }) => ({
      messages: [{
        role: "user" as const,
        content: {
          type: "text" as const,
          text: `List the most recent transfers for profile ${profileId} using list_transfers. Show them in a table with date, amount, currency, status, and recipient.`,
        },
      }],
    })
  );

  return server.server;
}

export function createSandboxServer() {
  return createServer({
    config: {
      WISE_API_TOKEN: "sandbox",
    },
  });
}
