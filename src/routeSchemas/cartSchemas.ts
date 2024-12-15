export const addProductsSchema = {
  body: {
    type: "object",
    required: ["tags"],
    properties: {
      tags: { type: "array", items: { type: "string" } },
    },
  },
};

export const addSingleProductSchema = {
  body: {
    type: "object",
    required: ["rfid"],
    properties: {
      rfid: { type: "string" },
    },
  },
};

export const changeAdditionalItemQuantitySchema = {
  body: {
    type: "object",
    required: ["itemId", "quantity"],
    properties: {
      itemId: { type: "string" },
      quantity: { type: "number" },
    },
  },
};
