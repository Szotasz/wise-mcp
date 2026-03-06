# Wise MCP Szerver

MCP (Model Context Protocol) szerver a [Wise (TransferWise)](https://wise.com) API-hoz.

Ez a szerver lehetővé teszi, hogy AI asszisztensek (pl. Claude) lekérdezhessék a Wise számla egyenlegét, árfolyamokat, átutalásokat és kedvezményezetteket.

## Távoli használat (Smithery)

A legegyszerűbb módja a szerver használatának, ha a Smithery-n keresztül csatlakozol — nem kell semmit telepítened:

[![Smithery Badge](https://smithery.ai/badge/aiamindennapokban/wise-mcp)](https://smithery.ai/servers/aiamindennapokban/wise-mcp)

**[Csatlakozás a Smithery-n](https://smithery.ai/servers/aiamindennapokban/wise-mcp)**

A Smithery automatikusan bekéri a Wise API tokenedet és kezeli a kapcsolatot.

## Funkciók

### Lekérdező eszközök (csak olvasás)
- **list_profiles** - Profilok (személyes/üzleti) listázása
- **get_profile** - Profil adatainak lekérdezése
- **list_balances** - Egyenlegek listázása pénznem szerint
- **get_balance** - Adott egyenleg részletei
- **get_exchange_rate** - Aktuális árfolyam két pénznem között
- **get_exchange_rate_history** - Árfolyam-történeti adatok
- **create_quote** - Árajánlatkérés (díj és árfolyam)
- **get_quote** / **get_temporary_quote** - Árajánlat lekérdezése
- **list_recipients** - Kedvezményezettek listázása
- **get_recipient** - Kedvezményezett részletei
- **get_account_requirements** - Bankszámla-mező követelmények adott pénznemhez
- **list_transfers** - Átutalások listázása szűrőkkel
- **get_transfer** - Átutalás részletei
- **get_delivery_estimate** - Becsült érkezési idő

### Írási eszközök (pénzforgalom)
- **create_transfer** - Átutalás létrehozása
- **fund_transfer** - Átutalás finanszírozása egyenlegből
- **create_recipient** - Új kedvezményezett felvétele
- **delete_recipient** - Kedvezményezett törlése
- **cancel_transfer** - Átutalás visszavonása

> **Figyelmeztetés:** Az írási eszközök valós pénzmozgást indíthatnak! Javasoljuk, hogy ezeket az eszközöket csak tudatosan engedélyezd. A legtöbb MCP kliens (pl. Claude Desktop, Claude Code) lehetőséget ad az egyes eszközök egyenkénti engedélyezésére vagy tiltására. Ha csak egyenleg-lekérdezésre és árfolyam-ellenőrzésre van szükséged, tiltsd le az írási eszközöket.

## Előfeltétel

Wise Personal API token szükséges. Igényelhető itt:
- https://wise.com/settings/api-tokens

## Helyi telepítés

Ha inkább lokálisan szeretnéd futtatni a szervert:

### 1. Telepítés

```bash
git clone https://github.com/Szotasz/wise-mcp.git
cd wise-mcp
npm install
npm run build
```

### 2. Konfigurálás

Másold az `.env.example` fájlt `.env` néven és töltsd ki:

```bash
cp .env.example .env
```

Szükséges környezeti változó:
| Változó | Leírás |
|---|---|
| `WISE_API_TOKEN` | Wise Personal API token |

### 3. Hozzáadás a Claude Code-hoz

Add hozzá a `~/.claude/settings.json` fájlhoz:

```json
{
  "mcpServers": {
    "wise": {
      "command": "node",
      "args": ["/elérési/út/wise-mcp/dist/cli.js"],
      "env": {
        "WISE_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

Az írási eszközök tiltásához add hozzá a `settings.local.json` fájlhoz:

```json
{
  "permissions": {
    "deny": [
      "mcp__wise__create_transfer",
      "mcp__wise__fund_transfer",
      "mcp__wise__create_recipient",
      "mcp__wise__delete_recipient",
      "mcp__wise__cancel_transfer"
    ]
  }
}
```

## Használati példák

Konfigurálás után a következőket kérdezheted Claude-tól:

- "Mennyi pénz van a Wise számlámon?"
- "Mi az aktuális EUR/HUF árfolyam?"
- "Listázd az utolsó átutalásaimat"
- "Milyen pénznemekben van egyenlegem?"

## Támogatás

Ha hasznosnak találtad ezt a projektet, támogathatod a fejlesztést:

[![Támogass a Donably-n](https://img.shields.io/badge/T%C3%A1mogat%C3%A1s-Donably-18b8c4)](https://www.donably.com/ai-a-mindennapokban-szabolccsal)

---

# Wise MCP Server (English)

MCP (Model Context Protocol) server for the [Wise (TransferWise)](https://wise.com) API.

This server allows AI assistants like Claude to query Wise account balances, exchange rates, transfers, and recipients.

## Remote Usage (Smithery)

The easiest way to use this server is through Smithery — no installation needed:

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

> **Warning:** Write tools can initiate real financial transactions! We recommend enabling these tools only when you explicitly need them. Most MCP clients (e.g. Claude Desktop, Claude Code) allow you to enable or disable individual tools. If you only need balance checks and exchange rates, disable the write tools.

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

To deny write tools, add to your `settings.local.json`:

```json
{
  "permissions": {
    "deny": [
      "mcp__wise__create_transfer",
      "mcp__wise__fund_transfer",
      "mcp__wise__create_recipient",
      "mcp__wise__delete_recipient",
      "mcp__wise__cancel_transfer"
    ]
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
