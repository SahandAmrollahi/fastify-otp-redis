const { faker } = require("@faker-js/faker");

const OTP_CODES = {};

module.exports = function (
  ds = {
    set: (m, c) => {
      OTP_CODES[m] = c;
    },
    get: (m) => {
      return OTP_CODES[m];
    },
    del:(m)=>{
      delete OTP_CODES[m]
    }
  }
) {
  return {
    generateOtpCode: async function (mobile) {
      const code = faker.string.numeric(6);
      await ds.set(`otpCodes:${mobile}`, code);
      return code;
    },
    verifyOtpCode: async function (mobile, code) {
      const generatedCode = await ds.get(`otpCodes:${mobile}`);
      const verified = generatedCode === code;
      if (verified) {
        ds.del(`otpCodes:${mobile}`);
      }
      return verified;
    },
  };
};
