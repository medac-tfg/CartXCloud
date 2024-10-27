import fastifyPlugin from "fastify-plugin";
import { startOrder } from "../controllers/cartController.js";
import cartMiddleware from "../middleware/cartMiddleware.js";

export default fastifyPlugin(async (fastify, _opts) => {
  // User registration route
  fastify.route({
    method: "POST",
    url: "/api/cart/startOrder",
    handler: startOrder,
    preHandler: cartMiddleware,
    /*
    schema: {
      body: {
        type: "object",
        required: ["name", "username", "phone", "password", "birthday"],
        properties: {
          name: { type: "string" },
          username: { type: "string" },
          phone: { type: "string" },
          password: { type: "string" },
          birthday: { type: "string" },
        },
      },
    },*/
  });
});