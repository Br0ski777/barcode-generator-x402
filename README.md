# Barcode Generator API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://barcode-generator.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Generate barcodes -- EAN-13, UPC-A, Code128, Code39. Base64 SVG output, custom width and height. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "barcode-generator": {
      "url": "https://barcode-generator.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://barcode-generator.api.klymax402.com/api/barcode" \
  -H "Content-Type: application/json" \
  -d '{"data":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `utility_generate_barcode` | POST | `/api/barcode` | $0.003 | Generate a barcode from text or number |

### `utility_generate_barcode`

Use this when you need to generate a barcode from text or a number. Returns base64-encoded SVG image in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `data` | string | yes | Data to encode in the barcode |
| `format` | string | no | Barcode format: code128, code39, ean13, upca (default: code128) |
| `width` | number | no | Bar width in pixels (default: 2) |
| `height` | number | no | Barcode height in pixels (default: 100) |

Example response:

```json
{"data":"5901234123457","format":"ean13","image":"PHN2ZyB4bWxu...","width":264,"height":142}
```

**When to use**: product labeling, inventory management, shipping labels, retail POS systems, and asset tracking barcodes.

**Not for**: QR codes (use `utility_generate_qr_code`), image resizing (use `media_resize_image`), PDF generation (use `document_generate_pdf`).

## Example agent prompts

- "Generate a barcode from text or a number"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
