"use strict";

const { faker } = require("@faker-js/faker");

const RedisDS = require("../../../service/redis-otp-store");

const Otp = require("../../../service/otp");

module.exports = async function (fastify, opts) {
  const option = {
    schema: {
      description: "verify users otp code",
      tags: ["otp"],
      summary: "verifies if user input code is valid",
      params: {
        type: "object",
        properties: {
          mobile: {
            type: "string",
            description: "user mobile number",
          },
          code: {
            type: "string",
            description: "user received code",
          },
        },
      },
    },
  };
  const otpService = Otp(RedisDS(fastify.redis));

  fastify.get("/:mobile/:code", option, async function (request, reply) {
    const { mobile, code } = request.params;
    // const generatedCode = await fastify.redis.get(`otpCodes:${mobile}`);
    const verified = await otpService.verifyOtpCode(mobile, code);
    return {
      ok: verified,
    };
  });
};
