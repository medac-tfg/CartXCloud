import { FastifyRequest, FastifyReply } from "fastify";
import Ticket from "../models/ticketModel.js";
import Product from "../models/productModel.js";
import ScannedProduct from "../models/scannedProductModel.js";
import AdditionalProduct from "../models/additionalProductModel.js";

import {
  StartOrderBody,
  AddProductsBody,
  ChangeAdditionalItemQuantityBody,
  AddSingleProductBody,
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

  const ticket = await Ticket.create({ shoppingMethod, cart: request.cartId });

  return { ticketId: ticket._id };
};

const addProducts = async (
  request: FastifyRequest<{ Body: AddProductsBody }>,
  reply: FastifyReply
) => {
  const { ticketId, tags } = request.body;

  if (!ticketId || !tags || !Array.isArray(tags) || tags.length === 0) {
    reply
      .code(400)
      .send({ message: "Ticket ID and a list of RFID tags are required" });
    return;
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    reply.code(404).send({ message: "Ticket not found" });
    return;
  }

  const scannedProducts = await ScannedProduct.find({ rfid: { $in: tags } });
  if (!scannedProducts || scannedProducts.length === 0) {
    reply
      .code(404)
      .send({ message: "No products found for the provided tags" });
    return;
  }

  // Build a map of productId to quantity
  const productQuantities: { [productId: string]: number } = {};

  scannedProducts.forEach((sp) => {
    const productIdStr = sp.productId.toString();
    productQuantities[productIdStr] =
      (productQuantities[productIdStr] || 0) + 1;
  });

  const uniqueProductIds = Object.keys(productQuantities);

  // Get all required products in a single query
  const ticketProductIds = ticket.products.map((p) => p.id.toString());
  const allProductIds = Array.from(
    new Set([...uniqueProductIds, ...ticketProductIds])
  );

  const allProducts = await Product.find({ _id: { $in: allProductIds } });

  // Create a map of productId to product for quick access
  const productMap = new Map<string, Product>();
  allProducts.forEach((product) => {
    productMap.set(product._id.toString(), product);
  });

  // Update the ticket's products
  for (const productIdStr of uniqueProductIds) {
    const quantityToAdd = productQuantities[productIdStr] || 0;

    const existingProduct = ticket.products.find(
      (p) => p.id.toString() === productIdStr
    );

    if (existingProduct) {
      existingProduct.quantity += quantityToAdd;
    } else {
      const product = productMap.get(productIdStr);
      if (product) {
        ticket.products.push({
          id: product._id,
          priceNoVat: product.priceNoVat,
          tax: product.tax,
          quantity: quantityToAdd,
        });
      }
    }
  }

  await ticket.save();

  // Prepare the list of products to return
  const productsToReturn = ticket.products
    .map((ticketProduct) => {
      const product = productMap.get(ticketProduct.id.toString());

      if (product) {
        return {
          id: product._id,
          priceNoVat: product.priceNoVat,
          tax: product.tax,
          quantity: ticketProduct.quantity,
          image: product.image,
          name: product.name,
          description: product.description,
        };
      } else {
        // If the product is not found, do not include it in the returned list
        return null;
      }
    })
    .filter((item) => item !== null);

  reply.send(productsToReturn);
};

const addSingleProduct = async (
  request: FastifyRequest<{ Body: AddSingleProductBody }>,
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

export {
  startOrder,
  addProducts,
  addSingleProduct,
  changeAdditionalItemQuantity,
};
