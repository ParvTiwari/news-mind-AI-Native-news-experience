require('dotenv').config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');

const env = require('./config/env');
const { optionalAuth } = require('./middleware/authMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { rateLimit } = require('./middleware/rateLimit');
const newsRoutes = require('./routes/newsRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('CORS not allowed'));
    }
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'newsmind-backend', now: new Date().toISOString() });
});

app.use(optionalAuth);
app.use('/api', newsRoutes);
app.use('/api/profile', profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`NewsMind backend running on port ${env.PORT}`);
});
