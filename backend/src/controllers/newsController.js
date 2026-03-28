const { fetchBusinessNews } = require('../services/newsService');
const { personalizeAndRank, rankRelevantArticles } = require('../services/personalizationService');
const { enrichArticles, askQuestion } = require('../services/aiService');
const { getUserProfile } = require('../services/profileStore');
const { normalizeInterests } = require('../utils/normalize');

async function getNews(req, res, next) {
  try {
    const userId = req.query.userId || req.user?.uid || 'guest';
    const profile = await getUserProfile(userId);

    const explicitInterests = normalizeInterests(req.query.interests);
    const interests = explicitInterests.length ? explicitInterests : normalizeInterests(profile.interests);
    const roleType = req.query.roleType || profile.roleType || 'student';

    const articles = await fetchBusinessNews();
    const ranked = personalizeAndRank(articles, interests);
    const enriched = await enrichArticles(ranked, { ...profile, roleType });

    res.json({
      userId,
      roleType,
      interests,
      totalCandidateArticles: articles.length,
      returnedArticles: enriched.length,
      articles: enriched
    });
  } catch (error) {
    next(error);
  }
}

async function askNews(req, res, next) {
  try {
    const { question } = req.body;
    const userId = req.body.userId || req.user?.uid || 'guest';
    const profile = await getUserProfile(userId);

    const articles = await fetchBusinessNews();
    const ranked = personalizeAndRank(articles, normalizeInterests(profile.interests));
    const topArticles = rankRelevantArticles(question, ranked, 5);
    const answer = await askQuestion(question, topArticles, profile);

    res.json({
      answer,
      usedArticles: topArticles.map((article) => ({ id: article.id, title: article.title, source: article.source }))
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNews,
  askNews
};
