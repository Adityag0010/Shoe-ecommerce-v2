import { LRUCache } from "lru-cache";

// Configure LRU Cache
const options = {
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes time to live
};

export const cache = new LRUCache(options);

export const cacheMiddleware = (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    return res.status(200).json(cachedResponse);
  }

  console.log(`Cache miss for ${key}`);

  // Need to intercept the response json method to cache it before sending
  const originalJson = res.json;
  res.json = (body) => {
    // Only cache successful responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, body);
    }
    // Call the original json method
    originalJson.call(res, body);
  };

  next();
};
