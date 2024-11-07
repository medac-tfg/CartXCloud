import { FastifyReply, FastifyRequest } from "fastify";

const panelIndex = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.view("index.eta");
};

export { panelIndex };
