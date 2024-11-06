import fastify from "fastify";
import fastifySocket from "fastify-socket.io";

import cartRoutes from "./routes/cartRoutes.js";
import securityRoutes from "./routes/securityRoutes.js";
import stockerRoutes from "./routes/stockerRoutes.js";

const server = fastify();

// Socket
server.register(fastifySocket as any, {
  cors: {
    origin: "*",
  },
});

// Register routes
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
