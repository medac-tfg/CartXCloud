import fastify from "fastify";
import fastifySocket from "fastify-socket.io";
import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import { fileURLToPath } from "url";
import { Eta } from "eta";
import path from "path";

import cartRoutes from "./routes/cartRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import stockerRoutes from "./routes/stockerRoutes.js";
import panelRoutes from "./routes/panelRoutes.js";

const eta = new Eta();
const server = fastify();

// Views
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.register(fastifyView, {
  engine: {
    eta,
  },
  templates: path.join(__dirname, "views"),
});
server.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

// Socket
server.register(fastifySocket as any, {
  cors: {
    origin: "*",
  },
});

// Register routes
server.register(panelRoutes);
server.register(cartRoutes);
server.register(securityRoutes);
server.register(stockerRoutes);

const APP_PORT = Number(process.env.APP_PORT) || 3000;
server.listen({ port: APP_PORT }, (err, address) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server listening at ${address}`);
});
