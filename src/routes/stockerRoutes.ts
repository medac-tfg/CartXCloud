import fastifyPlugin from "fastify-plugin";
import stockerAppMiddleware from "../middleware/stockerAppMiddleware.js";
import {
  getLastStoredProducts,
  getShopStatus,
} from "../controllers/stockerController.js";

export default fastifyPlugin(async (fastify, _opts) => {
  // Get shop status
  fastify.route({
    method: "GET",
    url: "/api/stocker/getShopStatus",
    handler: getShopStatus,
    preHandler: stockerAppMiddleware,
  });

  // Get last stored products
  fastify.route({
    method: "GET",
    url: "/api/stocker/getLastStoredProducts",
    handler: getLastStoredProducts,
    preHandler: stockerAppMiddleware,
  });

  // Get top sold items
  fastify.route({
    method: "GET",
    url: "/api/stocker/getTopSoldItems",
    handler: getShopStatus,
    preHandler: stockerAppMiddleware,
  });

  // Get product by barcode
  fastify.route({
    method: "GET",
    url: "/api/stocker/getProductByBarcode",
    handler: getShopStatus,
    preHandler: stockerAppMiddleware,
  });
});
