import { FastifyRequest, FastifyReply } from "fastify";
import Ticket from "../models/ticketModel.js";
import Category from "../models/categoryModel.js";
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

  // Get all required products in a single query and populate category name
  const ticketProductIds = ticket.products.map((p) => p.id.toString());
  const allProductIds = Array.from(
    new Set([...uniqueProductIds, ...ticketProductIds])
  );

  // Type definition for a product with populated category
  type ProductWithCategory = Product & {
    category: Category; // Category is fully populated
  };

  const allProducts = (await Product.find({
    _id: { $in: allProductIds },
  })
    .populate({
      path: "category",
      select: "name image", // Include the name and image of the category
    })
    .exec()) as unknown as ProductWithCategory[];

  // Create a map of productId to product for quick access
  const productMap = new Map<string, ProductWithCategory>();
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
          id: product._id.toString(),
          priceNoVat: product.priceNoVat,
          tax: product.tax,
          quantity: ticketProduct.quantity,
          image: product.image,
          name: product.name,
          description: product.description,
          category: product.category.name,
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null) as Array<{
    id: string;
    priceNoVat: number;
    tax: number;
    quantity: number;
    image: string;
    name: string;
    description: string;
    category: string; // Only category name
  }>;

  // Build categories to return
  const categoryMap = new Map<
    string,
    {
      id: string;
      name: string;
      image: string;
      productQuantity: number;
    }
  >();

  // Populate categoryMap directly from productMap
  allProducts.forEach((product) => {
    if (product.category && product.category._id) {
      const categoryIdStr = product.category._id.toString();
      if (!categoryMap.has(categoryIdStr)) {
        categoryMap.set(categoryIdStr, {
          id: categoryIdStr,
          name: product.category.name,
          image: product.category.image,
          productQuantity: 0,
        });
      }
    }
  });

  // Update product quantities in categoryMap
  productsToReturn.forEach((product) => {
    const category = allProducts
      .find((p) => p.name === product.name)
      ?.category._id.toString();

    if (category && categoryMap.has(category)) {
      const categoryEntry = categoryMap.get(category)!;
      categoryEntry.productQuantity += product.quantity || 0;
    }
  });

  const categoriesToReturn = Array.from(categoryMap.values());

  reply.send({ products: productsToReturn, categories: categoriesToReturn });
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
