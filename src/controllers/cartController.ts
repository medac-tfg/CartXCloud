import { FastifyRequest, FastifyReply } from "fastify";
import Ticket from "../models/ticketModel.js";

import { AddProductBody } from "../@types/cart.js";
import ScannedProduct from "../models/scannedProductModel.js";
import Product from "../models/productModel.js";

const startOrder = async (_request: FastifyRequest, _reply: FastifyReply) => {
  const ticket = await Ticket.create();
  return ticket;
};

const addProduct = async (
  request: FastifyRequest<{ Body: AddProductBody }>,
  reply: FastifyReply
) => {
  const { ticketId, rfid } = request.body;
  if (!ticketId || !rfid) {
    reply.code(400).send({ message: "Ticket ID and RFID are required" });
    return;
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    reply.code(404).send({ message: "Ticket not found" });
    return;
  }

  const scannedProduct = await ScannedProduct.findOne({ rfid });
  if (!scannedProduct) {
    reply.code(404).send({ message: "Scanned Product not found" });
    return;
  }

  const product = await Product.findById(scannedProduct.productId);
  if (!product) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }
  
  ticket.products.push({
    id: product._id,
    priceNoVat: product.priceNoVat,
    tax: product.tax,
  });

  await ticket.save();

  return ticket;
};

export { startOrder, addProduct };
