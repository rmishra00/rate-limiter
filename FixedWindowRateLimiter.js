class FixedWindowRateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requestTracker = new Map()

    setInterval(() => {
      this.cleanUpExpiredUsers()
    }, this.windowMs)
  }
  allowRequest(ip) {
    //first user, ip doesn't exist
    const now = Date.now();
    if (!this.requestTracker.has(ip)) {
      const user = {
        count: 1,
        startTime: now, 
        lastRequestTime:now
      }
      this.requestTracker.set(ip, user)
      return {
        allowed: true,
        remaining: this.limit - user.count
      }
    }
    //existing user
    const user = this.requestTracker.get(ip);

    //if window expired
    if (now - user.startTime > this.windowMs) {
      user.count = 1;
      user.startTime = now;
      user.lastRequestTime=now;
      return {
        allowed: true,
        remaining: this.limit - user.count
      }
    }
    //limit reached
    if (user.count >= this.limit) {
      this.lastRequestTime = now;
      return {
        allowed: false,
        remaining: 0
      }
    }
    //allow request
    user.count++;
    user.lastRequestTime = now;
    console.log({
      ip,
      count: user.count
    })
    return {
      allowed: true,
      remaining: this.limit - user.count
    }
  }
  cleanUpExpiredUsers() {
    const now = Date.now();
    for (const [ip, user] of this.requestTracker) {
      if (now - user.lastRequestTime > this.windowMs) {
        this.requestTracker.delete(ip);
      }
    }
  }
}
module.exports = FixedWindowRateLimiter;
