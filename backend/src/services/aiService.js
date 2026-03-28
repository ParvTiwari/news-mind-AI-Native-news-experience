const path = require('path');
const { getCached, setCached } = require('../utils/cache');

const llmService = require(path.resolve(__dirname, '../../../llm/ai.service.js'));

async function enrichArticle(article, userProfile) {
  const cacheKey = `ai:${article.id}:${userProfile.roleType || 'student'}`;
  const cached = getCached(cacheKey);
  if (cached) return { ...article, ...cached };

  const [summary, explanation, whyItMatters] = await Promise.all([
    llmService.generateSummary(article),
    llmService.generateExplanation(article),
    llmService.generateWhyItMatters(article, userProfile)
  ]);

  const insights = { summary, explanation, whyItMatters };
  setCached(cacheKey, insights, 3600);

  return {
    ...article,
    ...insights,
    relevanceReason: article.ranking?.matchedInterests?.length
      ? `Matched interests: ${article.ranking.matchedInterests.join(', ')}`
      : 'General business relevance'
  };
}

async function enrichArticles(articles = [], userProfile = {}) {
  return Promise.all(articles.map((article) => enrichArticle(article, userProfile)));
}

async function askQuestion(question, articles, userProfile) {
  return llmService.answerNewsQuestion(question, articles, userProfile);
}

module.exports = {
  enrichArticles,
  askQuestion
};
