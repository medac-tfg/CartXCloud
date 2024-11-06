import { FastifyRequest, FastifyReply } from "fastify";

const getShopStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  return "xd";
};

const getLastStoredProducts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return "xd";
};

const getTopSoldItems = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return "xd";
};

const getProductByBarcode = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { barcode } = request.query as { barcode: string };
  if (!barcode) {
    return reply.status(400).send("Barcode is required");
  }

  return "xd";
};

export {
  getShopStatus,
  getLastStoredProducts,
  getTopSoldItems,
  getProductByBarcode,
};
