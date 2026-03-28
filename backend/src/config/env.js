const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requireEnv(name, { allowEmpty = false } = {}) {
  const value = process.env[name];
  if (allowEmpty) return value;
  if (!value || !String(value).trim()) {
    return null;
  }
  return value;
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3000),
  NEWS_API_KEY: requireEnv('NEWS_API_KEY'),
  GNEWS_API_KEY: requireEnv('GNEWS_API_KEY'),
  GROQ_API_KEY: requireEnv('GROQ_API_KEY'),
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  FIREBASE_PROJECT_ID: requireEnv('FIREBASE_PROJECT_ID'),
  FIREBASE_CLIENT_EMAIL: requireEnv('FIREBASE_CLIENT_EMAIL'),
  FIREBASE_PRIVATE_KEY: requireEnv('FIREBASE_PRIVATE_KEY', { allowEmpty: true }),
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
};
