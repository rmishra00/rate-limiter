const RedisFixedWindowRateLimiter = require('../redislimiters/RedisFixedWindowRateLimiter');

const limiter = new RedisFixedWindowRateLimiter(5, 60);

async function redisRateLimiterMiddleware(req,res,next){
  const ip = req.ip;
  const result = await limiter.allowRequest(ip);
  console.log({
    ip,
    allowed:result.allowed,
    remaining:result.remaining
  });

  if(!result.allowed){
    return res.status(429).json({
      message:'Too many requests'
    })
  }
  next();
}

module.exports = redisRateLimiterMiddleware;