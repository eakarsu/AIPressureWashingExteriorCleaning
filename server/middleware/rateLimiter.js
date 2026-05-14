// In-memory rate limiter: aiRateLimiter = 20 requests/hour keyed by userId or IP

const requestCounts = new Map();

function createRateLimiter(maxRequests, windowMs) {
  return (req, res, next) => {
    const key = req.user?.id || req.user?.userId || req.ip;
    const now = Date.now();
    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      });
    }

    entry.count++;
    next();
  };
}

const aiRateLimiter = createRateLimiter(20, 60 * 60 * 1000);

module.exports = { aiRateLimiter };
