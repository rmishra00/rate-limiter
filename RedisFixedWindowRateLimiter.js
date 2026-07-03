const {redisClient} = require('./redisClient');

class RedisFixedWindowRateLimiter{
  constructor(limit, windowSec){
    this.limit = limit,
    this.windowMs = windowMs
  }
  async allowRequest(ip){
    const key = `rate-limit:${ip}`;
    const count = await redisClient.incr(key);
    if(count === 1){
      await redisClient.expire(
        key,
        this.windowMs
      )
    }
    if(count>this.limit){
      return{
        allowed:false,
        remaining:0
      }
    }
    return{
      allowed:true,
      remaining:this.limit-count
    }
  }
}
module.exports = RedisFixedWindowRateLimiter;