import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "barcode-generator",
  slug: "barcode-generator",
  description: "Generate barcodes -- EAN-13, UPC-A, Code128, Code39. Base64 SVG output, custom width and height.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/barcode",
      price: "$0.001",
      description: "Generate a barcode from text or number",
      toolName: "utility_generate_barcode",
      toolDescription: `Use this when you need to generate a barcode from text or a number. Returns base64-encoded SVG image in JSON.

Returns: 1. image (base64 SVG string) 2. format used (code128/code39/ean13/upca) 3. data encoded 4. width and height in pixels.

Example output: {"data":"5901234123457","format":"ean13","image":"PHN2ZyB4bWxu...","width":264,"height":142}

Use this FOR product labeling, inventory management, shipping labels, retail POS systems, and asset tracking barcodes.

Do NOT use for QR codes -- use utility_generate_qr_code instead. Do NOT use for image resizing -- use media_resize_image instead. Do NOT use for PDF generation -- use document_generate_pdf instead.`,
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
