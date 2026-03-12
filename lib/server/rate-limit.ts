const inMemoryLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = inMemoryLimits.get(key);

  if (!current || current.resetAt < now) {
    inMemoryLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: current.resetAt - now };
  }

  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}
