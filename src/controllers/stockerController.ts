import { FastifyRequest, FastifyReply } from "fastify";

import Product from "../models/productModel.js";
import ScannedProduct from "../models/scannedProductModel.js";
import SoldProduct from "../models/soldProductModel.js";

import { AddScannedProductBody, GetProductQuery } from "../@types/stocker.js";

const getShopStatus = async (
  _request: FastifyRequest,
  _reply: FastifyReply
) => {
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
  try {
    const lastStoredProducts = await ScannedProduct.aggregate([
      // Sort by createdAt descending to get the latest scanned products
      { $sort: { createdAt: -1 } },
      // Limit to the last 100 scanned products to have a good sample size
      { $limit: 100 },
      // Group by productId to aggregate counts and get the most recent createdAt
      {
        $group: {
          _id: "$productId",
          quantity: { $sum: 1 },
          firstCreatedAt: { $first: "$createdAt" },
        },
      },
      // Sort the groups by the most recent createdAt
      { $sort: { firstCreatedAt: -1 } },
      // Limit to up to 3 products
      { $limit: 3 },
      // Lookup product details from the Product collection
      {
        $lookup: {
          from: "products", // Replace with the actual collection name if different
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      // Unwind the productDetails array to simplify the structure
      { $unwind: "$productDetails" },
      // Project the required fields: name, weight, and quantity
      {
        $project: {
          _id: 0,
          name: "$productDetails.name",
          weight: "$productDetails.weight",
          quantity: 1,
        },
      },
    ]);

    console.log(lastStoredProducts);

    return lastStoredProducts;
  } catch (error) {
    _reply.status(500).send({ error: "Failed to retrieve last stored products" });
  }
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
