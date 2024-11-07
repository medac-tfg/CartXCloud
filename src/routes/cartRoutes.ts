import fastifyPlugin from "fastify-plugin";
import { addProduct, startOrder } from "../controllers/cartController.js";
import cartMiddleware from "../middleware/cartMiddleware.js";
import { addProductSchema } from "../routeSchemas/cartSchemas.js";

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
});