
export const addProductSchema = {
  body: {
    type: "object",
    required: ["ticketId", "rfid"],
    properties: {
      ticketId: { type: "string" },
      rfid: { type: "string" },
    },
  },
}