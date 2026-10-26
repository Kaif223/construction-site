/**
 * Fixed-window rate limiter kept in memory.
 *
 * This is a best-effort guard for a single server instance. On serverless or
 * multi-instance hosting each instance has its own counters, so production
 * should use a shared store (e.g. Redis, a KV store or the host's WAF rules).
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function check(key: string, now = Date.now()) {
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      if (hits.size > 10_000) {
        for (const [storedKey, value] of hits) if (value.resetAt <= now) hits.delete(storedKey);
      }
      return { allowed: true, retryAfterSeconds: 0 };
    }
    entry.count += 1;
    if (entry.count > limit) {
      return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  };
}
