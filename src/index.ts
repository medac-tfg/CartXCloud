import fastify from "fastify";
import fastifySocket from "fastify-socket.io";

import cartRoutes from "./routes/cartRoutes.js";

const server = fastify();

// Socket
server.register(fastifySocket as any, {
  cors: {
    origin: "*",
  },
});

// Register routes
server.register(cartRoutes);

const APP_PORT = Number(process.env.APP_PORT) || 3000;
server.listen({ port: APP_PORT }, (err, address) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server listening at ${address}`);
});
