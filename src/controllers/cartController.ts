import { FastifyRequest, FastifyReply } from "fastify";
import Big from "big.js";

import Ticket from "../models/ticketModel.js";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import ScannedProduct from "../models/scannedProductModel.js";
import Shop from "../models/shopModel.js";

import {
  BaseParams,
  StartOrderBody,
  AddProductsBody,
  AddSingleProductBody,
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

  const shop = await Shop.findById(request.cart.shop);
  if (!shop) {
    reply.code(404).send({ message: "Shop not found" });
    return;
  }

  const additionalProducts =
    shop.additionalProductList?.map((product) => ({
      _id: product._id,
      name: product.name,
      image: product.image,
      priceNoVat: product.priceNoVat,
      tax: product.tax,
      quantity: 0,
    })) || [];

  const ticket = await Ticket.create({
    shoppingMethod,
    cart: request.cart._id,
    additionalProducts: additionalProducts,
  });

  return { ticketId: ticket._id };
};

const addProducts = async (
  request: FastifyRequest<{ Params: BaseParams; Body: AddProductsBody }>,
  reply: FastifyReply
) => {
  const { tags } = request.body;
  const { ticketId } = request.params;

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
      select: "name icon", // Include the name and icon of the category
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
          name: product.name,
          description: product.description,
          brand: product.brand,
          image: product.image,
          priceNoVat: product.priceNoVat,
          tax: product.tax,
          weight: product.weight,
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
          name: product.name,
          description: product.description,
          brand: product.brand,
          image: product.image,
          priceNoVat: product.priceNoVat,
          tax: product.tax,
          weight: product.weight,
          category: product.category.name,
          quantity: ticketProduct.quantity,
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null) as Array<{
    id: string;
    name: string;
    description: string;
    brand: string;
    image: string;
    priceNoVat: number;
    tax: number;
    weight: number;
    category: string; // Only category name
    quantity: number;
  }>;

  // Build categories to return
  const categoryMap = new Map<
    string,
    {
      id: string;
      name: string;
      icon: { lib: string; icon: string };
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
          icon: product.category.icon,
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
  request: FastifyRequest<{ Params: BaseParams; Body: AddSingleProductBody }>,
  reply: FastifyReply
) => {
  const { rfid } = request.body;
  const { ticketId } = request.params;

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
    name: product.name,
    description: product.description,
    brand: product.brand,
    image: product.image,
    priceNoVat: product.priceNoVat,
    tax: product.tax,
    weight: product.weight,
    quantity: 1,
  });

  await ticket.save();

  return ticket;
};

const getAdditionalProducts = async (
  request: FastifyRequest<{ Params: BaseParams }>,
  reply: FastifyReply
) => {
  const { ticketId } = request.params;
  if (!ticketId) {
    reply.code(400).send({ message: "Ticket ID is required" });
    return;
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    reply.code(404).send({ message: "Ticket not found" });
    return;
  }

  return ticket.additionalProducts;
};

const changeAdditionalItemQuantity = async (
  request: FastifyRequest<{
    Params: BaseParams;
    Body: ChangeAdditionalItemQuantityBody;
  }>,
  reply: FastifyReply
) => {
  const { itemId, quantity } = request.body;
  const { ticketId } = request.params;

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

  const additionalProduct = ticket.additionalProducts.find(
    (p) => p._id.toString() === itemId.toString()
  );
  if (!additionalProduct) {
    reply.code(404).send({ message: "Additional product not found" });
    return;
  }

  additionalProduct.quantity = quantity;

  await ticket.save();

  return ticket.additionalProducts;
};

const getTicketInvoice = async (
  request: FastifyRequest<{ Params: BaseParams }>,
  reply: FastifyReply
) => {
  const { ticketId } = request.params;
  if (!ticketId) {
    reply.code(400).send({ message: "Ticket ID is required" });
    return;
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    reply.code(404).send({ message: "Ticket not found" });
    return;
  }

  const shop = await Shop.findById(request.cart.shop);
  if (!shop) {
    reply.code(404).send({ message: "Shop not found" });
    return;
  }

  let subtotal = new Big(0);
  let totalTax = new Big(0);
  let discount = new Big(0);

  // Calculate subtotal and tax for products
  ticket.products.forEach((product) => {
    const productPrice = new Big(product.priceNoVat).times(product.quantity);
    subtotal = subtotal.plus(productPrice);
    totalTax = totalTax.plus(productPrice.times(product.tax));
  });

  // Calculate subtotal and tax for additional products
  ticket.additionalProducts.forEach((product) => {
    const productPrice = new Big(product.priceNoVat).times(product.quantity);
    subtotal = subtotal.plus(productPrice);
    totalTax = totalTax.plus(productPrice.times(product.tax));
  });

  // Calculate total discount
  ticket.discounts.forEach((discountObj) => {
    discount = discount.plus(discountObj.amount);
  });

  // Calculate total
  const total = subtotal.plus(totalTax).minus(discount);

  return {
    subtotal: subtotal.toFixed(2),
    discount: discount.toFixed(2),
    totalTax: totalTax.toFixed(2),
    total: total.toFixed(2),
  };
};

export {
  startOrder,
  addProducts,
  addSingleProduct,
  getAdditionalProducts,
  changeAdditionalItemQuantity,
  getTicketInvoice,
};
