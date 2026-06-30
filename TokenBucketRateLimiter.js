class TokenBucketRateLimiter {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.requestTracker = new Map();
  }
  allowRequest(ip) {
    const now = Date.now();
    if (!this.requestTracker.has(ip)) {
      const user = {
        tokens: this.capacity - 1,
        lastRefillTime: now
      }
      this.requestTracker.set(ip, user);
      return {
        allowed: true,
        tokens: user.tokens
      }
    }
    const user = this.requestTracker.get(ip);
    const timePassed = (now - user.lastRefillTime) / 1000;
    const tokensToAdd = this.refillRate * timePassed;
    user.tokens = Math.min(this.capacity,  user.tokens+tokensToAdd );
    user.lastRefillTime = now;
    if (user.tokens >= 1) {
      user.tokens--;
      return {
        allowed: true,
        tokens: user.tokens

      }
    }
    return {
      allowed: false,
      tokens: user.tokens

    }
  }
}

module.exports = TokenBucketRateLimiter;