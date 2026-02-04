/**
 * Caching Middleware
 * Implements in-memory caching for frequently accessed data
 * Cache TTL: 5 minutes (configurable)
 */

const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Generate cache key from request
 */
const generateCacheKey = (req) => {
  const baseUrl = req.originalUrl || req.url;
  const queryString = JSON.stringify(req.query);
  return `${req.method}:${baseUrl}:${queryString}`;
};

/**
 * Cache middleware
 * Caches GET requests only
 */
const cacheMiddleware = (ttl = DEFAULT_TTL) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for authenticated routes (user-specific data)
    if (req.user) {
      return next();
    }

    const cacheKey = generateCacheKey(req);
    const cached = cache.get(cacheKey);

    if (cached) {
      // Check if cache is still valid
      if (Date.now() < cached.expiresAt) {
        return res.json(cached.data);
      } else {
        // Cache expired, remove it
        cache.delete(cacheKey);
      }
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function (data) {
      // Cache the response
      cache.set(cacheKey, {
        data,
        expiresAt: Date.now() + ttl,
        createdAt: Date.now()
      });

      // Call original json method
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache for a specific pattern
 */
const clearCache = (pattern) => {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  cache.clear();
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
  const stats = {
    size: cache.size,
    keys: Array.from(cache.keys()),
    entries: Array.from(cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.createdAt,
      expiresIn: value.expiresAt - Date.now()
    }))
  };
  return stats;
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache,
  getCacheStats
};











