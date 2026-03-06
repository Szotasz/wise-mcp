const DEFAULT_BASE_URL = "https://api.wise.com";

export class WiseApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`Wise API error ${status}: ${JSON.stringify(body)}`);
    this.name = "WiseApiError";
  }
}

export class WiseClient {
  private token: string;
  private baseUrl: string;

  constructor(token: string, baseUrl?: string) {
    this.token = token;
    this.baseUrl = baseUrl || DEFAULT_BASE_URL;
  }

  private async request(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
  ): Promise<unknown> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errorBody: unknown;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }
      throw new WiseApiError(res.status, errorBody);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return res.json();
    }

    return res.text();
  }

  get(path: string, query?: Record<string, string | number | boolean | undefined>) {
    return this.request("GET", path, undefined, query);
  }

  post(path: string, body?: unknown) {
    return this.request("POST", path, body);
  }

  put(path: string, body?: unknown) {
    return this.request("PUT", path, body);
  }

  delete(path: string) {
    return this.request("DELETE", path);
  }
}
