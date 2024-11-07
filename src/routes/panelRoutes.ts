import fastifyPlugin from "fastify-plugin";
import { panelIndex } from "../controllers/panelController.js";


export default fastifyPlugin(async (fastify, _opts) => {
  // Dashboard
  fastify.route({
    method: "GET",
    url: "/",
    handler: panelIndex,
  });
});
