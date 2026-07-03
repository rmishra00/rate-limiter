const {redisClient} = require('../redisClient');
const fs = require('fs');


class RedisFixedWindowRateLimiter{
  constructor(limit, windowSec){
    this.limit = limit;
    this.windowSec = windowSec;
    this.fixedWindowLuaScript = fs.readFileSync('./lua/fixedWindow.lua', 'utf-8')
  }
  async allowRequest(ip){
    const key = `rate-limit:${ip}`;
    const count = await redisClient.eval(
      this.fixedWindowLuaScript,
      {
        keys:[key],
        arguments:[this.windowSec]
      }
    )
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