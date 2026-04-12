import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "barcode-generator",
  slug: "barcode-generator",
  description: "Generate barcodes in multiple formats — EAN-13, UPC-A, Code128, Code39, QR. Returns base64 SVG.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/barcode",
      price: "$0.001",
      description: "Generate a barcode from text or number",
      toolName: "utility_generate_barcode",
      toolDescription: "Use this when you need to generate a barcode from text or a number. Supports EAN-13, UPC-A, Code128, Code39 formats. Returns base64 SVG image. Do NOT use for QR codes — use utility_generate_qr_code instead. Do NOT use for color palettes — use design_generate_color_palette instead.",
      inputSchema: {
        type: "object",
        properties: {
          data: { type: "string", description: "Data to encode in the barcode" },
          format: { type: "string", description: "Barcode format: code128, code39, ean13, upca (default: code128)" },
          width: { type: "number", description: "Bar width in pixels (default: 2)" },
          height: { type: "number", description: "Barcode height in pixels (default: 100)" },
        },
        required: ["data"],
      },
    },
  ],
};
