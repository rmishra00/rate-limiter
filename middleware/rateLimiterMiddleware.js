// const FixedWindowRateLimiter = require('./FixedWindowRateLimiter');
// const limiter = new FixedWindowRateLimiter(5, 60000);
const TokenBucketRateLimiter = require('../in-memorylimiters/In-memoryTokenBucketRateLimiter');
const limiter = new TokenBucketRateLimiter(5, 0)

function rateLimiterMiddleware(req,res,next){
  const ip = req.ip;
  const result = limiter.allowRequest(ip);
  // res.setHeader("X-RateLimit-Limit", limiter.limit);
  // res.setHeader("X-RateLimit-Remaining", result.remaining);
  console.log({
    ip, 
    allowed:result.allowed,
    tokensRemaining:result.tokens
  })
  if(!result.allowed){
    return res.status(429).json({
      message:"Too many requests"
    })
  }
    next();
} 
module.exports = rateLimiterMiddleware;