const store = new Map();

function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

function setCached(key, value, ttl = 600) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttl * 1000
  });
}

module.exports = { getCached, setCached };
