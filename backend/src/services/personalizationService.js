const { normalizeInterest } = require('../utils/normalize');

const KEYWORD_MAP = {
  markets: ['market', 'stock', 'equity', 'index', 'bond', 'nasdaq', 'dow'],
  startups: ['startup', 'founder', 'venture', 'series', 'seed', 'funding'],
  ai: ['ai', 'artificial intelligence', 'llm', 'model', 'nvidia', 'chip'],
  policy: ['policy', 'regulation', 'fed', 'government', 'law', 'tariff'],
  global: ['global', 'international', 'europe', 'asia', 'middle east'],
  earnings: ['earnings', 'quarter', 'revenue', 'profit', 'guidance'],
  fintech: ['fintech', 'payments', 'bank', 'lending', 'crypto']
};

function extractText(article) {
  return [article.title, article.description, article.content, article.source].join(' ').toLowerCase();
}

function scoreByInterests(article, interests = []) {
  const text = extractText(article);
  const normalized = interests.map(normalizeInterest);
  const matches = [];

  normalized.forEach((interest) => {
    const keywords = KEYWORD_MAP[interest] || [interest];
    if (keywords.some((keyword) => text.includes(keyword))) {
      matches.push(interest);
    }
  });

  return matches;
}

function recencyScore(publishedAt) {
  const hours = (Date.now() - new Date(publishedAt).getTime()) / 36e5;
  if (Number.isNaN(hours)) return 0;
  if (hours <= 2) return 2.5;
  if (hours <= 8) return 1.5;
  if (hours <= 24) return 1;
  if (hours <= 48) return 0.5;
  return 0;
}

function personalizeAndRank(articles = [], interests = []) {
  const scored = articles.map((article) => {
    const matched = scoreByInterests(article, interests);
    const score = matched.length * 3 + recencyScore(article.publishedAt);

    return {
      ...article,
      ranking: {
        score: Number(score.toFixed(2)),
        matchedInterests: matched,
        recency: recencyScore(article.publishedAt)
      }
    };
  });

  const filtered = interests.length ? scored.filter((item) => item.ranking.matchedInterests.length) : scored;
  return filtered.sort((a, b) => b.ranking.score - a.ranking.score).slice(0, 20);
}

function rankRelevantArticles(question, articles = [], limit = 5) {
  const terms = question
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 2);

  return [...articles]
    .map((article) => {
      const text = extractText(article);
      const score = terms.reduce((acc, term) => (text.includes(term) ? acc + 1 : acc), 0) + recencyScore(article.publishedAt);
      return { ...article, questionScore: score };
    })
    .sort((a, b) => b.questionScore - a.questionScore)
    .slice(0, limit);
}

module.exports = { personalizeAndRank, rankRelevantArticles };
