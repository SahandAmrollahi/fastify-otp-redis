module.exports = function(redis) {
  return {
    set: async (key, code) => {
      await redis.set(key, code, "EX", 120);
    },
    get: async (key) => {
      return await redis.get(key);
    },
    del:async (key)=>{
        await redis.del(key)
    }
  };
};
