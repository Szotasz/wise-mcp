# Wise MCP Szerver

MCP (Model Context Protocol) szerver a [Wise (TransferWise)](https://wise.com) API-hoz.

Ez a szerver lehetovve teszi, hogy AI asszisztensek (pl. Claude) lekerdezhessek a Wise szamla egyenleget, arfolyamokat, atutalasokat es kedvezmenyezetteket.

## Tavoli hasznalat (Smithery)

A legegyszerubb mod a szerver hasznalatanak, ha a Smithery-n keresztul csatlakozol -- nem kell semmit telepitened:

[![Smithery Badge](https://smithery.ai/badge/aiamindennapokban/wise-mcp)](https://smithery.ai/servers/aiamindennapokban/wise-mcp)

**[Csatlakozas a Smithery-n](https://smithery.ai/servers/aiamindennapokban/wise-mcp)**

A Smithery automatikusan bekeri a Wise API tokenedet es kezeli a kapcsolatot.

## Funkciok

### Lekerdező eszkozok (csak olvasas)
- **list_profiles** - Profilok (szemelyes/uzleti) listazasa
- **get_profile** - Profil adatainak lekerdezese
- **list_balances** - Egyenlegek listazasa penznem szerint
- **get_balance** - Adott egyenleg reszletei
- **get_exchange_rate** - Aktualis arfolyam ket penznem kozott
- **get_exchange_rate_history** - Arfolyam-torteneti adatok
- **create_quote** - Arajanlatkerdezes (dij es arfolyam)
- **get_quote** / **get_temporary_quote** - Arajanlat lekerdezese
- **list_recipients** - Kedvezmenyezettek listazasa
- **get_recipient** - Kedvezmenyezett reszletei
- **get_account_requirements** - Bankszamla-mezo kovetelmenyek adott penznemhez
- **list_transfers** - Atutalasok listazasa szurokkel
- **get_transfer** - Atutalas reszletei
- **get_delivery_estimate** - Becsult erkezesi ido

### Irasi eszkozok (penzforgalom)
- **create_transfer** - Atutalas letrehozasa
- **fund_transfer** - Atutalas finanszirozasa egyenlegbol
- **create_recipient** - Uj kedvezmenyezett felvetele
- **delete_recipient** - Kedvezmenyezett torlese
- **cancel_transfer** - Atutalas visszavonasa

## Elofeltetel

Wise Personal API token szukseges. Igenyelheto itt:
- https://wise.com/settings/api-tokens

## Helyi telepites

Ha inkabb lokalisan szeretned futtatni a szervert:

### 1. Telepites

```bash
git clone https://github.com/Szotasz/wise-mcp.git
cd wise-mcp
npm install
npm run build
```

### 2. Konfiguralas

Masold az `.env.example` fajlt `.env` neven es toltsd ki:

```bash
cp .env.example .env
```

Szukseges kornyezeti valtozo:
| Valtozo | Leiras |
|---|---|
| `WISE_API_TOKEN` | Wise Personal API token |

### 3. Hozzaadas a Claude Code-hoz

Add hozza a `~/.claude/settings.json` fajlhoz:

```json
{
  "mcpServers": {
    "wise": {
      "command": "node",
      "args": ["/eleresi/ut/wise-mcp/dist/cli.js"],
      "env": {
        "WISE_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Hasznalati peldak

Konfiguralas utan a kovetkezoket kerdezheted Claude-tol:

- "Mennyi penz van a Wise szamlamon?"
- "Mi az aktualis EUR/HUF arfolyam?"
- "Listazd az utolso atutalasaimat"
- "Milyen penznemekben van egyenlegem?"

## Tamogatas

Ha hasznosnak talaltad ezt a projektet, tamogathatod a fejlesztest:

[![Tamogass a Donably-n](https://img.shields.io/badge/T%C3%A1mogat%C3%A1s-Donably-18b8c4)](https://www.donably.com/ai-a-mindennapokban-szabolccsal)

---

# Wise MCP Server (English)

MCP (Model Context Protocol) server for the [Wise (TransferWise)](https://wise.com) API.

This server allows AI assistants like Claude to query Wise account balances, exchange rates, transfers, and recipients.

## Remote Usage (Smithery)

The easiest way to use this server is through Smithery -- no installation needed:

[![Smithery Badge](https://smithery.ai/badge/aiamindennapokban/wise-mcp)](https://smithery.ai/servers/aiamindennapokban/wise-mcp)

**[Connect on Smithery](https://smithery.ai/servers/aiamindennapokban/wise-mcp)**

Smithery will automatically prompt you for your Wise API token and manage the connection.

## Features

### Query Tools (read-only)
- **list_profiles** - List all profiles (personal and business)
- **get_profile** - Get a specific profile by ID
- **list_balances** - List balance accounts with available amounts per currency
- **get_balance** - Get a specific balance account
- **get_exchange_rate** - Get current exchange rate between two currencies
- **get_exchange_rate_history** - Get historical exchange rates over a time period
- **create_quote** - Create a quote to check fees and exchange rates
- **get_quote** / **get_temporary_quote** - Retrieve an existing or temporary quote
- **list_recipients** - List recipient accounts, optionally filtered by currency
- **get_recipient** - Get a specific recipient by ID
- **get_account_requirements** - Get required fields for creating a recipient in a specific currency
- **list_transfers** - List transfers with optional filters (status, date range, pagination)
- **get_transfer** - Get a specific transfer by ID
- **get_delivery_estimate** - Get estimated delivery date for a transfer

### Write Tools (financial operations)
- **create_transfer** - Create a new transfer
- **fund_transfer** - Fund a transfer from your Wise balance
- **create_recipient** - Create a new recipient account
- **delete_recipient** - Delete (deactivate) a recipient account
- **cancel_transfer** - Cancel a transfer (if not yet completed)

## Prerequisites

You need a Wise Personal API token. Get one at:
- https://wise.com/settings/api-tokens

## Local Installation

If you prefer to run the server locally:

### 1. Install

```bash
git clone https://github.com/Szotasz/wise-mcp.git
cd wise-mcp
npm install
npm run build
```

### 2. Configure

Copy `.env.example` to `.env` and fill in your token:

```bash
cp .env.example .env
```

Required environment variable:
| Variable | Description |
|---|---|
| `WISE_API_TOKEN` | Wise Personal API token |

### 3. Add to Claude Code

Add to your `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "wise": {
      "command": "node",
      "args": ["/path/to/wise-mcp/dist/cli.js"],
      "env": {
        "WISE_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Usage Examples

Once configured, you can ask Claude:

- "How much money is in my Wise account?"
- "What is the current EUR to HUF exchange rate?"
- "List my recent transfers"
- "What currencies do I have balances in?"

## Support

If you find this project useful, you can support the development:

[![Support on Donably](https://img.shields.io/badge/Support-Donably-18b8c4)](https://www.donably.com/ai-a-mindennapokban-szabolccsal)

## License

MIT
