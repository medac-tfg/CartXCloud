import { FastifyRequest, FastifyReply } from "fastify";
import Cart from "../models/cartModel.js";

declare module "fastify" {
  interface FastifyRequest {
    cartId: string;
    cartToken: string;
    cart: Cart;
  }
}

const cartMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  // Get token from header and remove the "Bearer " part
  const cartId = request.headers.cartid as string;
  const token = request.headers.authorization?.split(" ")[1];

  // Check if no cartId
  if (!cartId) {
    reply.status(401).send("Cart ID is required");
    return;
  }

  // Check if no token
  if (!token) {
    reply.status(401).send("No token, authorization denied");
    return;
  }

  const cart = await Cart.findById(cartId);
  if (!cart) {
    reply.status(404).send("Cart not found");
    return;
  }

  if (!cart.accessTokens.includes(token)) {
    reply.status(401).send("Token is not valid");
    return;
  }

  request.cart = cart;
};

export default cartMiddleware;
