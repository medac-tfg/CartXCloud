import fastifyPlugin from "fastify-plugin";
import { getActiveDoors } from "../controllers/securityController.js";
import securityAppMiddleware from "../middleware/securityAppMiddleware.js";

export default fastifyPlugin(async (fastify, _opts) => {
  // Get active doors
  fastify.route({
    method: "POST",
    url: "/api/security/getActiveDoors",
    handler: getActiveDoors,
    preHandler: securityAppMiddleware,
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
