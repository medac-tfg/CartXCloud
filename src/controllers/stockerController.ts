import { FastifyRequest, FastifyReply } from "fastify";

import Product from "../models/productModel.js";
import ScannedProduct from "../models/scannedProductModel.js";
import SoldProduct from "../models/soldProductModel.js";

import { AddScannedProductBody, GetProductQuery } from "../@types/stocker.js";

const getShopStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  const productsCount = await Product.countDocuments();
  const soldProductsCount = await SoldProduct.countDocuments();
  const scannedProductsCount = await ScannedProduct.countDocuments();

  return {
    productsCount,
    soldProductsCount,
    scannedProductsCount,
  };
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
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const topSoldItems = await SoldProduct.aggregate([
      {
        $group: {
          _id: "$productId",
          totalSold: { $sum: 1 },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const populatedTopSoldItems = await SoldProduct.populate(topSoldItems, {
      path: "_id",
      model: "Product",
    });

    return populatedTopSoldItems;
  } catch (error) {
    reply.status(500).send({ error: "Failed to retrieve top sold items" });
  }
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
