const RedisTokenBucketRateLimiter = require('../redislimiters/RedisTokenBucketRateLimiter');

const limiter = new RedisTokenBucketRateLimiter(5,1, 86400);

async function RedisTokenBucketRateLimiterMiddleware(req, res, next) {
  const ip = req.ip;
  const result = await limiter.allowRequest(ip);
  console.log({
    ip,
    allowed: result.allowed,
    remaining: result.remaining
  });

  if(!result.allowed){
    return res.status(429).json({
      message:"Too many requests"
    })
  }

next();
}

module.exports = RedisTokenBucketRateLimiterMiddleware;