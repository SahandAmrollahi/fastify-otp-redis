"use strict";

const Otp = require("../../../service/otp");

const RedisDS = require("../../../service/redis-otp-store");

const z = require("zod");

const requestCodeParamSchema = z.object({
  mobile: z.custom((m) => {
    return m.match(/^0\d{10}/g);
  }),
});

module.exports = async function (fastify, opts) {
  const option = {
    schema: {
      description: "request otp code",
      tags: ["otp"],
      summary: "Sends an SMS with generated code",
      params: {
        type: "object",
        properties: {
          mobile: {
            type: "string",
            description: "user mobile number",
          },
        },
      },
    },
  };
  const otpService = Otp(RedisDS(fastify.redis));

  fastify.get("/:mobile", option, async function (request, reply) {
    const validateParams = requestCodeParamSchema.parse(request.params);
    const { mobile } = request.params;

    const code = await otpService.generateOtpCode(mobile);

    return { code, mobile };
  });
};
