"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    request.log.info(
      { qs: request.query, body: request.body, params: request.params },
      "new request"
    );
    return "this is an search";
  });
};
