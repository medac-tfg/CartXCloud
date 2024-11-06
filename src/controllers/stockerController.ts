import { FastifyRequest, FastifyReply } from "fastify";
import Product from "../models/productModel.js";
import { GetProductQuery } from "../@types/stocker.js";

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

export {
  getShopStatus,
  getLastStoredProducts,
  getTopSoldItems,
  getProductByBarcode,
};
