import { FastifyRequest, FastifyReply } from "fastify";
import Product from "../models/productModel.js";
import ScannedProduct from "../models/scannedProductModel.js";

import { AddScannedProductBody, GetProductQuery } from "../@types/stocker.js";

const getShopStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  return "xd";
};

const getLastStoredProducts = async (
  _request: FastifyRequest,
  _reply: FastifyReply
) => {
  const lastStoredProducts = await ScannedProduct.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("productId");

  return lastStoredProducts;
};

const getTopSoldItems = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return "xd";
};

const getProductByBarcode = async (
  request: FastifyRequest<{ Querystring: GetProductQuery }>,
  reply: FastifyReply
) => {
  const { barcode } = request.query;
  if (!barcode) {
    reply.status(400).send("Barcode is required");
    return;
  }

  const product = await Product.findOne({
    barcode,
  });
  if (!product) {
    reply.status(404).send("Product not found in database");
    return;
  }

  return product;
};

const addScannedProduct = async (
  request: FastifyRequest<{ Body: AddScannedProductBody }>,
  reply: FastifyReply
) => {
  const { productId, rfid } = request.body;
  if (!productId || !rfid) {
    reply.status(400).send("ProductId and RFID are required");
    return;
  }

  const product = await Product.findById(productId);
  if (!product) {
    reply.status(404).send("Product not found in database");
    return;
  }

  const scannedProduct = await ScannedProduct.create({
    productId,
    rfid,
  });

  return scannedProduct;
};

export {
  getShopStatus,
  getLastStoredProducts,
  getTopSoldItems,
  getProductByBarcode,
  addScannedProduct,
};
