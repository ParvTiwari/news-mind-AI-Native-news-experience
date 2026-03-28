const PERSONA_GUIDANCE = {
  investor: 'Prioritize market impact, upside/downside risk, and sectors likely to move next.',
  founder: 'Focus on competition, product strategy, go-to-market and funding signals.',
  student: 'Use plain language, define jargon, and explain first-order and second-order effects.'
};

function summaryPrompt(article) {
  return `Summarize the article in 2-3 concise bullet points.\nTitle: ${article.title}\nDescription: ${article.description}\nContent: ${article.content}`;
}

function explanationPrompt(article) {
  return `Explain this news in 2 short sentences: what happened and why now.\nTitle: ${article.title}\nDescription: ${article.description}`;
}

function whyItMattersPrompt(article, userProfile = {}) {
  const roleType = userProfile.roleType || 'student';
  return `Explain in one sentence why this matters to a ${roleType}. Guidance: ${PERSONA_GUIDANCE[roleType] || PERSONA_GUIDANCE.student}.\nTitle: ${article.title}\nDescription: ${article.description}`;
}

function answerQuestionPrompt(question, articles = [], roleType = 'student') {
  const context = articles
    .map((article, index) => `${index + 1}. ${article.title} | ${article.source} | ${article.description}`)
    .join('\n');

  return `You are a business news analyst for a ${roleType}.\nGuidance: ${PERSONA_GUIDANCE[roleType] || PERSONA_GUIDANCE.student}\nQuestion: ${question}\nUse ONLY the context below. If insufficient context, say so.\nContext:\n${context}\nReturn 4-6 bullet points and end with one 'What to watch next' bullet.`;
}

module.exports = {
  summaryPrompt,
  explanationPrompt,
  whyItMattersPrompt,
  answerQuestionPrompt,
  PERSONA_GUIDANCE
};
