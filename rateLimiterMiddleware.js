const FixedWindowRateLimiter = require('./FixedWindowRateLimiter');
const limiter = new FixedWindowRateLimiter(5, 60000);

function rateLimiterMiddleware(req,res,next){
  const ip = req.ip;
  const result = limiter.allowRequest(ip);
  res.setHeader("X-RateLimit-Limit", limiter.limit);
  res.setHeader("X-RateLimit-Remaining", result.remaining);

  if(!result.allowed){
    return res.status(429).json({
      message:"Too many requests"
    })
  }
    next();
} 
module.exports = rateLimiterMiddleware;