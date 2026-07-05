const {redisClient} = require('../redisClient');
const fs = require('fs');

class RedisTokenBucketRateLimiter{
  constructor(capacity, refillRate, ttl){
    this.capacity = capacity,
    this.refillRate = refillRate,
    this.ttl = ttl
    this.tokenBucketLuaScript = fs.readFileSync('./lua/tokenBucket.lua', 'utf-8')
  }
  async allowRequest(ip){
    const key = `token_bucket:${ip}`;
    const currentTime = Math.floor(Date.now()/1000);
    const args = [
      String(this.capacity),
      String(this.refillRate),
      String(currentTime),
      String(this.ttl) ]
    const remainingTokens = await redisClient.eval(
      this.tokenBucketLuaScript,{
      keys:[key],
      arguments:args
      }
    )
    console.log("Lua returned:", remainingTokens);
    if(remainingTokens < 0){
      return{
        allowed:false,
        remaining:0
      }
    }return{
      allowed:true,
      remaining:remainingTokens
    }

  }
}

module.exports = RedisTokenBucketRateLimiter;