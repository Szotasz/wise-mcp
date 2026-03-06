import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WiseClient } from "../wise-client.js";

export function registerProfileTools(server: McpServer, client: WiseClient) {
  server.tool(
    "list_profiles",
    "List all profiles (personal and business) associated with your Wise account",
    {},
    async () => {
      const result = await client.get("/v1/profiles");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    "get_profile",
    "Get a specific profile by ID",
    { profileId: z.number().describe("Profile ID") },
    async ({ profileId }) => {
      const result = await client.get(`/v1/profiles/${profileId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );
}
