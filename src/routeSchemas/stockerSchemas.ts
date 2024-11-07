export const getProductByBarcodeSchema = {
  querystring: {
    type: "object",
    required: ["barcode"],
    properties: {
      barcode: { type: "string" },
    },
  },
}

export const addScannedProductSchema = {
  body: {
    type: "object",
    required: ["productId", "rfid"],
    properties: {
      productId: { type: "string" },
      rfid: { type: "string" },
    },
  },
}