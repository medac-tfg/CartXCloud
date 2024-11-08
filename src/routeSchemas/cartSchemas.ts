export const addProductSchema = {
  body: {
    type: "object",
    required: ["ticketId", "rfid"],
    properties: {
      ticketId: { type: "string" },
      rfid: { type: "string" },
    },
  },
};

export const changeAdditionalItemSchema = {
  body: {
    type: "object",
    required: ["itemId", "ticketId", "quantity"],
    properties: {
      itemId: { type: "string" },
      ticketId: { type: "string" },
      quantity: { type: "number" },
    },
  },
};
