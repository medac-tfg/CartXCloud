import fastifyPlugin from "fastify-plugin";
import {
  startOrder,
  addProducts,
  addSingleProduct,
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
    url: "/api/cart/addProducts",
    handler: addProducts,
    preHandler: cartMiddleware,
    schema: addProductsSchema,
  });

  // Add single product to order
  fastify.route({
    method: "POST",
    url: "/api/cart/addSingleProduct",
    handler: addSingleProduct,
    preHandler: cartMiddleware,
    schema: addSingleProductSchema,
  });

  // Add additional product to order
  fastify.route({
    method: "POST",
    url: "/api/cart/changeAdditionalItemQuantity",
    handler: changeAdditionalItemQuantity,
    preHandler: cartMiddleware,
    schema: changeAdditionalItemQuantitySchema,
  });
});
