import { FastifyRequest, FastifyReply } from "fastify";

const cartMiddleware = (
  request: FastifyRequest,
  reply: FastifyReply,
  next: (err?: Error) => void
) => {
  // Get token from header and remove the "Bearer " part
  const token = request.headers.authorization?.split(" ")[1];

  // Check if no token
  if (!token) {
    return reply.status(401).send("No token, authorization denied");
  }

  try {
    next();
  } catch (err) {
    return reply.status(401).send("Token is not valid");
  }
};

export default cartMiddleware;
