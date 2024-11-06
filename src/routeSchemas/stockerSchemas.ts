export const getProductByBarcodeSchema = {
  querystring: {
    type: "object",
    required: ["barcode"],
    properties: {
      barcode: { type: "string" },
    },
  },
}