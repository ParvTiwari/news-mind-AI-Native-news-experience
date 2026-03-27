const hasGroqKey = Boolean(process.env.GROQ_API_KEY);

const providerConfig = {
  groq: {
    enabled: hasGroqKey,
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    apiKey: process.env.GROQ_API_KEY
  }
};

function hasAnyLLMKey() {
  return providerConfig.groq.enabled;
}

function resolveProvider() {
  return providerConfig.groq.enabled ? providerConfig.groq : null;
}

const personaPrompts = {
  investor: 'Focus on market movements, portfolio impact, and near-term risks/opportunities.',
  founder: 'Focus on competitive moves, funding signals, GTM implications, and strategic opportunities.',
  student: 'Explain in plain language and teach key concepts before jargon.'
};

function safePersona(persona) {
  return personaPrompts[persona] ? persona : 'student';
}

function buildFallbackWhyItMatters(article, persona) {
  const source = article.source || 'the market';
  if (persona === 'investor') {
    return `Track this because ${source} could influence earnings expectations and sentiment in related sectors.`;
  }
  if (persona === 'founder') {
    return `This is a strategy signal from ${source}; it may affect product positioning and roadmap priorities.`;
  }
  return 'This story helps you understand how business decisions create real-world impact in industries.';
}

function buildFallbackExplanation(article, persona) {
  const lead = article.description || article.title || 'This story';
  if (persona === 'student') {
    return `${lead}. In simple terms: this can shift prices, jobs, or investment direction across the sector.`;
  }
  return `${lead}. Watch second-order effects on competition, capital flow, and customer demand.`;
}

function extractJSONObject(text = '') {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error('Model response did not contain valid JSON');
  }
}

async function postChatCompletion(messages, temperature = 0.2) {
  const provider = resolveProvider();
  if (!provider) {
    throw new Error('No Groq API key configured');
  }

  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`
    },
    body: JSON.stringify({
      model: provider.model,
      temperature,
      messages
    })
  });

  if (!response.ok) {
    throw new Error(`LLM request failed (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function runLLMJson(prompt) {
  const content = await postChatCompletion(
    [
      {
        role: 'system',
        content:
          'Return valid JSON only. Do not wrap JSON in markdown code fences. Do not add any explanation text.'
      },
      { role: 'user', content: prompt }
    ],
    0.2
  );

  return extractJSONObject(content || '{}');
}

async function runLLMText(prompt) {
  return postChatCompletion([{ role: 'user', content: prompt }], 0.3);
}

async function enrichArticlesForPersona(articles, persona, interests = []) {
  const resolvedPersona = safePersona(persona);

  if (!hasAnyLLMKey()) {
    return articles.map((article) => ({
      ...article,
      summary: article.description || 'No summary available yet.',
      explanation: buildFallbackExplanation(article, resolvedPersona),
      whyItMatters: buildFallbackWhyItMatters(article, resolvedPersona),
      angle: resolvedPersona,
      relevanceReason: interests.length
        ? `Matched to interests: ${interests.join(', ')}`
        : `Tailored for ${resolvedPersona}`,
      format: resolvedPersona === 'student' ? 'explainer' : 'signal'
    }));
  }

  const prompt = `You are an AI newsroom editor. Return STRICT JSON only with this schema:
{
  "cards": [
    {
      "id": "string",
      "summary": "2 short bullet points max",
      "explanation": "1-2 sentence context and implications",
      "whyItMatters": "1 sentence",
      "relevanceReason": "short phrase",
      "format": "signal|explainer|brief"
    }
  ]
}

Persona: ${resolvedPersona}
Persona guidance: ${personaPrompts[resolvedPersona]}
Interests: ${interests.join(', ') || 'none specified'}
Articles: ${JSON.stringify(articles.map(({ id, title, description, source, publishedAt }) => ({ id, title, description, source, publishedAt })))}
`;

  const parsed = await runLLMJson(prompt);
  const byId = new Map((parsed.cards || []).map((card) => [card.id, card]));

  return articles.map((article) => {
    const card = byId.get(article.id) || {};
    return {
      ...article,
      summary: card.summary || article.description || 'No summary available yet.',
      explanation: card.explanation || buildFallbackExplanation(article, resolvedPersona),
      whyItMatters: card.whyItMatters || buildFallbackWhyItMatters(article, resolvedPersona),
      relevanceReason: card.relevanceReason || `Tailored for ${resolvedPersona}`,
      format: card.format || 'brief',
      angle: resolvedPersona
    };
  });
}

async function answerNewsQuestion(question, contextArticles = [], persona = 'student') {
  const resolvedPersona = safePersona(persona);

  if (!hasAnyLLMKey()) {
    const headlines = contextArticles.slice(0, 3).map((a) => `• ${a.title}`).join('\n');
    return `Quick take for a ${resolvedPersona}:\n${headlines || 'No fresh context available right now.'}\n\nAsk a narrower question (company, sector, or timeline) for a sharper answer.`;
  }

  const prompt = `You are a personalized business news analyst.
Persona: ${resolvedPersona}
Persona guidance: ${personaPrompts[resolvedPersona]}
Question: ${question}
Context articles:
${contextArticles
    .slice(0, 6)
    .map((a, i) => `${i + 1}. ${a.title} | ${a.source || 'Unknown source'} | ${a.description || ''}`)
    .join('\n')}

Answer in 4-6 concise bullet points with concrete implications.`;

  return runLLMText(prompt);
}

module.exports = { enrichArticlesForPersona, answerNewsQuestion };