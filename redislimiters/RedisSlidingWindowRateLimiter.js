const { redisClient } = require('../redisClient');
const fs = require('fs')

class RedisSlidingWindowRateLimiter {
  constructor(limit, windowSize, ttl) {
    this.limit = limit,
      this.windowSize = windowSize,
      this.ttl = ttl
    this.slidingWindowLuaScript = fs.readFileSync('./lua/slidingWindow.lua', 'utf-8')
  }

  async allowRequest(ip) {
    const key = `sliding_window:${ip}`;
    const currentTime = Date.now();
    const member = `${currentTime}-${Math.random()}`;
    const args = [
      String(this.limit),
      String(currentTime),
      String(this.windowSize),
      String(this.ttl),
      member
    ]
    const remainingRequests = await redisClient.eval(
      this.slidingWindowLuaScript, {
      keys: [key],
      arguments: args
    }
    )
    console.log('Lua returned', remainingRequests);
    if (remainingRequests < 0) {
      return {
        allowed: false,
        remaining: 0
      }
    } return {
      allowed: true,
      remaining: remainingRequests
    }
  }
}
module.exports = RedisSlidingWindowRateLimiter;