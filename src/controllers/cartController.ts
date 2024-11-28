import { FastifyRequest, FastifyReply } from "fastify";
import Ticket from "../models/ticketModel.js";
import Product from "../models/productModel.js";
import ScannedProduct from "../models/scannedProductModel.js";
import AdditionalProduct from "../models/additionalProductModel.js";

import {
  StartOrderBody,
  AddProductBody,
  ChangeAdditionalItemQuantityBody,
} from "../@types/cart.js";

const startOrder = async (
  request: FastifyRequest<{ Body: StartOrderBody }>,
  reply: FastifyReply
) => {
  const { shoppingMethod } = request.body;
  if (!shoppingMethod) {
    reply.code(400).send({ message: "Shopping method is required" });
    return;
  }

  // Note that cartId is already available in the request object due to the middleware
  const ticket = await Ticket.create({ shoppingMethod, cart: request.cartId });

  return { ticketId: ticket._id };
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

  const existingProduct = ticket.products.find(
    (p) => p.id.toString() === product._id.toString()
  );
  if (existingProduct) {
    existingProduct.quantity += 1;
    await ticket.save();
    return ticket;
  }

  ticket.products.push({
    id: product._id,
    priceNoVat: product.priceNoVat,
    tax: product.tax,
    quantity: 1,
  });

  await ticket.save();

  return ticket;
};

const changeAdditionalItemQuantity = async (
  request: FastifyRequest<{ Body: ChangeAdditionalItemQuantityBody }>,
  reply: FastifyReply
) => {
  const { itemId, ticketId, quantity } = request.body;
  if (!itemId || !ticketId || quantity === null) {
    reply
      .code(400)
      .send({ message: "Item ID, Ticket ID and Quantity are required" });
    return;
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    reply.code(404).send({ message: "Ticket not found" });
    return;
  }

  const additionalProduct = await AdditionalProduct.findById(itemId);
  if (!additionalProduct) {
    reply.code(404).send({ message: "Additional Product not found" });
    return;
  }

  const existingProduct = ticket.additionalProducts.find(
    (p) => p.id.toString() === additionalProduct._id.toString()
  );

  if (existingProduct) {
    if (quantity === 0) {
      ticket.additionalProducts = ticket.additionalProducts.filter(
        (p) => p.id.toString() !== additionalProduct._id.toString()
      );
    } else existingProduct.quantity = quantity;
  } else {
    ticket.additionalProducts.push({
      id: additionalProduct._id,
      priceNoVat: additionalProduct.priceNoVat,
      tax: additionalProduct.tax,
      quantity,
    });
  }

  await ticket.save();
  return ticket;
};

export { startOrder, addProduct, changeAdditionalItemQuantity };
