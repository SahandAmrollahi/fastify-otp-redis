"use strict";

const path = require("node:path");
const AutoLoad = require("@fastify/autoload");

// Pass --options via CLI arguments in command to enable these options.
const options = {};

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  await fastify.register(import("@fastify/swagger"), {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "OTP API documentation",
        description: "Testing the Fastify swagger API",
        version: "0.1.0",
      },
    },
  });

  await fastify.register(import("@fastify/swagger-ui"), {
    theme: {
      title: "OTP API documentation",
    },
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  fastify.register(require("@fastify/redis"), { host: "127.0.0.1" });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};

module.exports.options = options;
