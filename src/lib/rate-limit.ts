type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export function rateLimit(key: string) {
  const now = Date.now();
  const max = getLimit();
  const windowMs = 60 * 60 * 1000;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs
    });

    return {
      allowed: true,
      remaining: max - 1,
      resetAt: now + windowMs
    };
  }

  if (bucket.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.resetAt
    };
  }

  bucket.count += 1;

  return {
    allowed: true,
    remaining: max - bucket.count,
    resetAt: bucket.resetAt
  };
}

function getLimit() {
  const value = Number(process.env.RDW_RATE_LIMIT_PER_HOUR ?? 60);
  return Number.isFinite(value) && value > 0 ? value : 60;
}
