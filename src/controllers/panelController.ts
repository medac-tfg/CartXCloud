import { FastifyReply, FastifyRequest } from "fastify";

const panelIndex = async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.view("index.eta");
};

const cartsPage = async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.view("carts/index.eta");
};

const productListPage = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.view("products/list.eta");
};

const addProductPage = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.view("products/add.eta");
};

const categoriesPage = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.view("products/categories.eta");
};

const faqPage = async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.view("faq/index.eta");
};

export {
  panelIndex,
  cartsPage,
  productListPage,
  addProductPage,
  categoriesPage,
  faqPage,
};
