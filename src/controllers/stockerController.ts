import { FastifyRequest, FastifyReply } from "fastify";
import Product from "../models/productModel.js";
import { AddScannedProductBody, GetProductQuery } from "../@types/stocker.js";
import ScannedProduct from "../models/scannedProductModel.js";

const getShopStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  return "xd";
};

const getLastStoredProducts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return "xd";
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
    return reply.status(400).send("Barcode is required");
  }

  const product = await Product.findOne({
    barcode,
  });
  if (!product) {
    return reply.status(404).send("Product not found in database");
  }

  return product;
};

const addScannedProduct = async (
  request: FastifyRequest<{ Body: AddScannedProductBody }>,
  reply: FastifyReply
) => {
  const { productId, rfid } = request.body;
  if (!productId || !rfid) {
    return reply.status(400).send("ProductId and RFID are required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    return reply.status(404).send("Product not found in database");
  }

  const scannedProduct = new ScannedProduct({
    productId,
    rfid,
  });
  await scannedProduct.save();

  return scannedProduct;
};

export {
  getShopStatus,
  getLastStoredProducts,
  getTopSoldItems,
  getProductByBarcode,
  addScannedProduct,
};
