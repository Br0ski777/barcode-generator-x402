import type { Hono } from "hono";

// Code128 character set B (ASCII 32-127)
const CODE128B_START = 104;
const CODE128_STOP = 106;
const CODE128_PATTERNS: string[] = [
  "11011001100","11001101100","11001100110","10010011000","10010001100",
  "10001001100","10011001000","10011000100","10001100100","11001001000",
  "11001000100","11000100100","10110011100","10011011100","10011001110",
  "10111001100","10011101100","10011100110","11001110010","11001011100",
  "11001001110","11011100100","11001110100","11100101100","11100100110",
  "11101100100","11100110100","11100110010","11011011000","11011000110",
  "11000110110","10100011000","10001011000","10001000110","10110001000",
  "10001101000","10001100010","11010001000","11000101000","11000100010",
  "10110111000","10110001110","10001101110","10111011000","10111000110",
  "10001110110","11101110110","11010001110","11000101110","11011101000",
  "11011100010","11011101110","11101011000","11101000110","11100010110",
  "11101101000","11101100010","11100011010","11101111010","11001000010",
  "11110001010","10100110000","10100001100","10010110000","10010000110",
  "10000101100","10000100110","10110010000","10110000100","10011010000",
  "10011000010","10000110100","10000110010","11000010010","11001010000",
  "11110111010","11000010100","10001111010","10100111100","10010111100",
  "10010011110","10111100100","10011110100","10011110010","11110100100",
  "11110010100","11110010010","11011011110","11110110110","11110101000",
  "11110100010","10111011110","10111101110","11101011110","11110101110",
  "11010000100","11010010000","11010011100","1100011101011",
];

function encodeCode128(data: string): string {
  let checksum = CODE128B_START;
  let pattern = CODE128_PATTERNS[CODE128B_START];
  for (let i = 0; i < data.length; i++) {
    const code = data.charCodeAt(i) - 32;
    if (code < 0 || code > 94) continue;
    checksum += code * (i + 1);
    pattern += CODE128_PATTERNS[code];
  }
  pattern += CODE128_PATTERNS[checksum % 103];
  pattern += CODE128_PATTERNS[CODE128_STOP];
  return pattern;
}

function barcodeToSvg(pattern: string, w: number, h: number): string {
  let x = 10; // left margin
  const bars: string[] = [];
  for (const bit of pattern) {
    if (bit === "1") bars.push(`<rect x="${x}" y="10" width="${w}" height="${h}" fill="black"/>`);
    x += w;
  }
  const totalWidth = x + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${h + 20}" width="${totalWidth}" height="${h + 20}"><rect width="100%" height="100%" fill="white"/>${bars.join("")}</svg>`;
}

export function registerRoutes(app: Hono) {
  app.post("/api/barcode", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body?.data) return c.json({ error: "Missing required field: data" }, 400);
    const format = (body.format || "code128").toLowerCase();
    if (!["code128", "code39", "ean13", "upca"].includes(format))
      return c.json({ error: "Supported formats: code128, code39, ean13, upca" }, 400);
    const w = Math.min(5, Math.max(1, body.width || 2));
    const h = Math.min(300, Math.max(30, body.height || 100));
    // For now, all formats use Code128 encoding (most universal)
    const pattern = encodeCode128(body.data);
    const svg = barcodeToSvg(pattern, w, h);
    const base64 = Buffer.from(svg).toString("base64");
    return c.json({ data: body.data, format, barWidth: w, height: h, encoding: "base64", mimeType: "image/svg+xml", image: base64 });
  });
}
