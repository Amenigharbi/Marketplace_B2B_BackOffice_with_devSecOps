interface RateLimitResult {
  isAllowed: boolean;
  remaining: number;
}

const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();

export async function checkRateLimit(
  identifier: string,
  limit = 5,
  windowInSeconds = 60,
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = `rate-limit:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (entry && entry.expiresAt > now) {
    const newCount = entry.count + 1;
    rateLimitStore.set(key, { ...entry, count: newCount });
    return {
      isAllowed: newCount <= limit,
      remaining: Math.max(0, limit - newCount),
    };
  }

  rateLimitStore.set(key, {
    count: 1,
    expiresAt: now + windowInSeconds * 1000,
  });
  return { isAllowed: true, remaining: limit - 1 };
}
