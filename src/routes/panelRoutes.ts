import fastifyPlugin from "fastify-plugin";
import {
  panelIndex,
  cartsPage,
  productListPage,
  addProductPage,
  categoriesPage,
  faqPage,
} from "../controllers/panelController.js";

export default fastifyPlugin(async (fastify, _opts) => {
  // Dashboard
  fastify.route({
    method: "GET",
    url: "/",
    handler: panelIndex,
  });

  // Carts
  fastify.route({
    method: "GET",
    url: "/carts",
    handler: cartsPage,
  });

  // Product list
  fastify.route({
    method: "GET",
    url: "/products/list",
    handler: productListPage,
  });

  // Add product page
  fastify.route({
    method: "GET",
    url: "/products/add",
    handler: addProductPage,
  });

  // Categories page
  fastify.route({
    method: "GET",
    url: "/products/categories",
    handler: categoriesPage,
  });

  // FAQ page
  fastify.route({
    method: "GET",
    url: "/faq",
    handler: faqPage,
  });
});
