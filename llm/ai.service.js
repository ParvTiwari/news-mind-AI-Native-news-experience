const { summaryPrompt, explanationPrompt, whyItMattersPrompt, answerQuestionPrompt } = require('./promptTemplates');

const provider = {
  url: 'https://api.groq.com/openai/v1/chat/completions',
  model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  apiKey: process.env.GROQ_API_KEY
};

function isAiEnabled() {
  return Boolean(provider.apiKey);
}

async function callLLM(prompt, { temperature = 0.2 } = {}) {
  if (!isAiEnabled()) throw new Error('GROQ_API_KEY is missing');

  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`
    },
    body: JSON.stringify({
      model: provider.model,
      temperature,
      messages: [
        {
          role: 'system',
          content:
            'Return concise and factual answers. Do not hallucinate details not present in context. Never use markdown tables.'
        },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`LLM request failed (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

function fallbackSummary(article) {
  return article.description || 'Summary unavailable.';
}

function fallbackExplanation(article) {
  return `${article.title}: ${article.description || 'No additional context available.'}`;
}

function fallbackWhy(article, userProfile = {}) {
  return `For ${userProfile.roleType || 'students'}, this affects business expectations around ${article.source}.`;
}

async function generateSummary(article) {
  if (!isAiEnabled()) return fallbackSummary(article);
  return callLLM(summaryPrompt(article), { temperature: 0.2 });
}

async function generateExplanation(article) {
  if (!isAiEnabled()) return fallbackExplanation(article);
  return callLLM(explanationPrompt(article), { temperature: 0.3 });
}

async function generateWhyItMatters(article, userProfile = {}) {
  if (!isAiEnabled()) return fallbackWhy(article, userProfile);
  return callLLM(whyItMattersPrompt(article, userProfile), { temperature: 0.2 });
}

async function answerNewsQuestion(question, articles = [], userProfile = {}) {
  if (!isAiEnabled()) {
    const headlines = articles.map((article) => `• ${article.title}`).join('\n');
    return `${headlines || 'No relevant articles found.'}\nWhat to watch next: monitor policy updates and earnings guidance this week.`;
  }

  return callLLM(answerQuestionPrompt(question, articles, userProfile.roleType || 'student'), {
    temperature: 0.25
  });
}

module.exports = {
  isAiEnabled,
  generateSummary,
  generateExplanation,
  generateWhyItMatters,
  answerNewsQuestion
};
