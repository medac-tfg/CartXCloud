import fastifyPlugin from "fastify-plugin";
import {
  startOrder,
  addProducts,
  addSingleProduct,
  getAdditionalProducts,
  changeAdditionalItemQuantity,
} from "../controllers/cartController.js";
import cartMiddleware from "../middleware/cartMiddleware.js";
import {
  addProductsSchema,
  addSingleProductSchema,
  changeAdditionalItemQuantitySchema,
} from "../routeSchemas/cartSchemas.js";

export default fastifyPlugin(async (fastify, _opts) => {
  // Start order
  fastify.route({
    method: "POST",
    url: "/api/cart/startOrder",
    handler: startOrder,
    preHandler: cartMiddleware,
  });

  // Add product to order
  fastify.route({
    method: "POST",
    url: "/api/cart/:ticketId/addProducts",
    handler: addProducts,
    preHandler: cartMiddleware,
    schema: addProductsSchema,
  });

  // Add single product to order
  fastify.route({
    method: "POST",
    url: "/api/cart/:ticketId/addSingleProduct",
    handler: addSingleProduct,
    preHandler: cartMiddleware,
    schema: addSingleProductSchema,
  });

  // Get additional products
  fastify.route({
    method: "GET",
    url: "/api/cart/:ticketId/getAdditionalProducts",
    handler: getAdditionalProducts,
    preHandler: cartMiddleware,
  });

  // Add additional product to order
  fastify.route({
    method: "POST",
    url: "/api/cart/:ticketId/changeAdditionalItemQuantity",
    handler: changeAdditionalItemQuantity,
    preHandler: cartMiddleware,
    schema: changeAdditionalItemQuantitySchema,
  });
});
