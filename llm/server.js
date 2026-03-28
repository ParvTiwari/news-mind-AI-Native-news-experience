const express = require('express');
const { generateSummary, generateExplanation, generateWhyItMatters, answerNewsQuestion } = require('./ai.service');

const app = express();
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const article = req.body.article || {};
  const userProfile = req.body.userProfile || { roleType: 'student' };
  const [summary, explanation, whyItMatters] = await Promise.all([
    generateSummary(article),
    generateExplanation(article),
    generateWhyItMatters(article, userProfile)
  ]);

  res.json({ summary, explanation, whyItMatters });
});

app.post('/ask', async (req, res) => {
  const { question, articles, userProfile } = req.body;
  const answer = await answerNewsQuestion(question, articles, userProfile);
  res.json({ answer });
});

app.listen(3200, () => {
  console.log('LLM service listening on 3200');
});
