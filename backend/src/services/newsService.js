const NewsAPI = require('newsapi');
const env = require('../config/env');
const { getCached, setCached } = require('../utils/cache');
const { normalizeArticle } = require('../utils/normalize');

const newsapi = env.NEWS_API_KEY ? new NewsAPI(env.NEWS_API_KEY) : null;

async function fetchFromNewsApi() {
  const response = await newsapi.v2.topHeadlines({
    category: 'business',
    language: 'en',
    country: 'us',
    pageSize: 40
  });

  return (response.articles || []).map((article, idx) => normalizeArticle(article, idx));
}

async function fetchFromGNews() {
  const url = new URL('https://gnews.io/api/v4/top-headlines');
  url.searchParams.set('topic', 'business');
  url.searchParams.set('country', 'us');
  url.searchParams.set('lang', 'en');
  url.searchParams.set('max', '40');
  url.searchParams.set('token', env.GNEWS_API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`GNews request failed (${response.status})`);
  }

  const data = await response.json();
  return (data.articles || []).map((article, idx) => normalizeArticle(article, idx));
}

function dedupeArticles(articles = []) {
  const seen = new Set();
  return articles.filter((article) => {
    const key = `${article.title}-${article.source}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchBusinessNews() {
  const cached = getCached('business-news');
  if (cached) return cached;

  let articles = [];
  if (newsapi) {
    articles = await fetchFromNewsApi();
  } else if (env.GNEWS_API_KEY) {
    articles = await fetchFromGNews();
  } else {
    throw new Error('No news provider configured. Add NEWS_API_KEY or GNEWS_API_KEY.');
  }

  const deduped = dedupeArticles(articles);
  setCached('business-news', deduped, 300);
  return deduped;
}

module.exports = { fetchBusinessNews };
