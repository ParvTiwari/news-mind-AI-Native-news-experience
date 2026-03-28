function normalizeInterest(value = '') {
  return String(value).trim().toLowerCase();
}

function normalizeInterests(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map(normalizeInterest).filter(Boolean);
  }

  return String(input)
    .split(',')
    .map(normalizeInterest)
    .filter(Boolean);
}

function normalizeArticle(raw, idx = 0) {
  return {
    id: raw.id || `${raw.source?.id || raw.source?.name || raw.source || 'src'}-${idx}`,
    title: raw.title || 'Untitled article',
    description: raw.description || '',
    url: raw.url || '',
    source: raw.source?.name || raw.source || 'Unknown source',
    publishedAt: raw.publishedAt || new Date().toISOString(),
    imageUrl: raw.urlToImage || raw.image || '',
    content: raw.content || ''
  };
}

module.exports = {
  normalizeInterest,
  normalizeInterests,
  normalizeArticle
};
