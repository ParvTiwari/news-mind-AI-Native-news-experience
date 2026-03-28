function validateGetNews(req, res, next) {
  const { interests } = req.query;
  if (interests && typeof interests !== 'string') {
    return res.status(400).json({ error: 'interests must be a comma-separated string' });
  }
  return next();
}

function validateAskNews(req, res, next) {
  const { question } = req.body || {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'question is required' });
  }

  return next();
}

module.exports = { validateGetNews, validateAskNews };
