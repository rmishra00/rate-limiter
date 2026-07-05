const RedisSlidingWindowRateLimiter = require('../redislimiters/RedisSlidingWindowRateLimiter');

const limiter = new RedisSlidingWindowRateLimiter(5, 5000, 86400);

async function RedisSlidingWindowRateLimiterMiddleWare(req, res, next) {
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
  next()
}

module.exports = RedisSlidingWindowRateLimiterMiddleWare;