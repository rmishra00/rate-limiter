function createRateLimiterMiddleware(limiter) {
  return async (req, res, next) => {
    const result = await limiter.allowRequest(req.ip);

    res.setHeader(
      "X-RateLimit-Remaining",
      result.remaining
    );

    if (!result.allowed) {
      return res.status(429).json({
        message: "Too many requests"
      })
    }
    next();
  }
}

module.exports = createRateLimiterMiddleware;