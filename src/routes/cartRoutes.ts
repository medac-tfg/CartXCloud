import fastifyPlugin from "fastify-plugin";
import {
  startOrder,
  addProduct,
  changeAdditionalItemQuantity,
} from "../controllers/cartController.js";
import cartMiddleware from "../middleware/cartMiddleware.js";
import {
  addProductSchema,
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
    url: "/api/cart/addProduct",
    handler: addProduct,
    preHandler: cartMiddleware,
    schema: addProductSchema,
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
