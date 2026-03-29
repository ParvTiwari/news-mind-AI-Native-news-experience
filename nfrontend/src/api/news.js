// ─────────────────────────────────────────────────────────────────────────────
// src/api/news.js  (v3 — interest-based "For You" + Insights all-categories)
// ─────────────────────────────────────────────────────────────────────────────

const API_KEY  = import.meta.env.VITE_NEWS_API_KEY
const BASE_URL = 'https://newsapi.org/v2'

// ─── Interest ID → API query config ──────────────────────────────────────────
// These are the same IDs used in the interest picker (Login.jsx)
const INTEREST_QUERY_MAP = {
  business  : { endpoint: 'top-headlines', params: { category: 'business',   country: 'us', pageSize: 5 } },
  technology: { endpoint: 'top-headlines', params: { category: 'technology', country: 'us', pageSize: 5 } },
  general   : { endpoint: 'top-headlines', params: { category: 'general',    country: 'us', pageSize: 5 } },
  science   : { endpoint: 'top-headlines', params: { category: 'science',    country: 'us', pageSize: 5 } },
  health    : { endpoint: 'top-headlines', params: { category: 'health',     country: 'us', pageSize: 5 } },
  finance   : { endpoint: 'top-headlines', params: { category: 'business',   country: 'us', pageSize: 5 } },
  startups  : { endpoint: 'everything',    params: { q: 'startup OR "venture capital" OR "series A" funding', language: 'en', sortBy: 'publishedAt', pageSize: 5 } },
  ai        : { endpoint: 'everything',    params: { q: 'artificial intelligence OR "machine learning" OR OpenAI OR ChatGPT', language: 'en', sortBy: 'publishedAt', pageSize: 5 } },
}

// ─── Tab → API config (for Markets / Tech / Startups tabs) ───────────────────
const TAB_QUERY_MAP = {
  Markets  : { endpoint: 'top-headlines', params: { category: 'business',   country: 'us' } },
  Startups : { endpoint: 'everything',    params: { q: 'startup OR "venture capital" OR "series A" OR funding', language: 'en', sortBy: 'publishedAt' } },
  Tech     : { endpoint: 'top-headlines', params: { category: 'technology', country: 'us' } },
}

// ─── ALL categories fetched for Insights page ────────────────────────────────
const INSIGHTS_QUERIES = [
  { endpoint: 'top-headlines', params: { category: 'business',   country: 'us', pageSize: 5 } },
  { endpoint: 'top-headlines', params: { category: 'technology', country: 'us', pageSize: 5 } },
  { endpoint: 'top-headlines', params: { category: 'general',    country: 'us', pageSize: 5 } },
  { endpoint: 'top-headlines', params: { category: 'science',    country: 'us', pageSize: 4 } },
  { endpoint: 'top-headlines', params: { category: 'health',     country: 'us', pageSize: 4 } },
  { endpoint: 'everything',    params: { q: 'artificial intelligence OR OpenAI', language: 'en', sortBy: 'publishedAt', pageSize: 4 } },
]

// ─── Sentiment word lists ─────────────────────────────────────────────────────
const POSITIVE_WORDS = ['surge', 'rise', 'gain', 'high', 'record', 'profit', 'growth',
  'rally', 'boost', 'launch', 'raises', 'wins', 'beats', 'soar', 'jump', 'breakthrough']
const NEGATIVE_WORDS = ['fall', 'drop', 'crash', 'low', 'loss', 'decline', 'cut', 'debt',
  'risk', 'slump', 'warning', 'fear', 'hike', 'plunge', 'tumble', 'crisis']

const getGlow = (title = '') => {
  const t = title.toLowerCase()
  if (POSITIVE_WORDS.some(w => t.includes(w))) return 'green'
  if (NEGATIVE_WORDS.some(w => t.includes(w))) return 'red'
  return 'blue'
}
const getUrgency = (glow) => (glow === 'green' || glow === 'red' ? 'High' : 'Medium')

const GRADIENTS = {
  green: { gradient: 'from-emerald-900/60 to-teal-900/30',  borderColor: 'border-emerald-500/30', glowColor: 'rgba(16,220,138,0.15)' },
  red  : { gradient: 'from-red-900/60 to-rose-900/30',      borderColor: 'border-red-500/30',     glowColor: 'rgba(255,77,109,0.15)'  },
  blue : { gradient: 'from-blue-900/50 to-indigo-900/30',   borderColor: 'border-blue-500/25',    glowColor: 'rgba(42,165,255,0.12)'  },
  amber: { gradient: 'from-amber-900/40 to-orange-900/20',  borderColor: 'border-amber-500/20',   glowColor: 'rgba(255,179,71,0.10)'  },
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80'

// ─── Format raw NewsAPI article → our NewsCard format ────────────────────────
export const formatArticle = (raw, index) => {
  const glow    = getGlow(raw.title)
  const urgency = getUrgency(glow)
  const { gradient, borderColor, glowColor } = GRADIENTS[glow]

  const whyItMatters = raw.description
    ? raw.description.split('.')[0] + '.'
    : 'Follow this story for the latest updates.'

  return {
    id         : `${raw.source?.id || 'ns'}-${index}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
    title      : raw.title       || 'Untitled Article',
    description: raw.description || 'No description available.',
    whyItMatters,
    tags       : [raw.source?.name || 'News', urgency === 'High' ? 'Breaking' : 'Update'],
    urgency,
    category   : 'General',
    glow,
    gradient,
    borderColor,
    glowColor,
    imageUrl   : raw.urlToImage || FALLBACK_IMAGE,
    url        : raw.url,
    source     : raw.source?.name || 'Unknown',
    time       : getTimeAgo(raw.publishedAt ? new Date(raw.publishedAt) : new Date()),
    publishedAt: raw.publishedAt,
    sentiment  : glow === 'green' ? 1 : glow === 'red' ? -1 : 0,
  }
}

// ─── Time-ago helper ──────────────────────────────────────────────────────────
const getTimeAgo = (date) => {
  const s = Math.floor((new Date() - date) / 1000)
  if (s < 60)    return 'Just now'
  if (s < 3600)  return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`
  return `${Math.floor(s / 86400)} days ago`
}

// ─── Low-level: fetch one API config → array of raw articles ─────────────────
// Returns [] on failure so one bad call never crashes the whole page
const fetchSingle = async (config) => {
  try {
    const params = new URLSearchParams({
      ...config.params,
      pageSize: config.params.pageSize || 10,
      apiKey  : API_KEY,
    })
    const res = await fetch(`${BASE_URL}/${config.endpoint}?${params}`)
    if (!res.ok) return []
    const data = await res.json()
    if (data.status !== 'ok') return []
    return (data.articles || []).filter(
      a => a.title && !a.title.includes('[Removed]') && a.url
    )
  } catch {
    return []
  }
}

// ─── Deduplicate articles by URL ──────────────────────────────────────────────
const dedupe = (articles) => {
  const seen = new Set()
  return articles.filter(a => {
    if (seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })
}

// ─── Fisher-Yates shuffle ─────────────────────────────────────────────────────
const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── "For You": fetch based on user interests ─────────────────────────────────
// interests = ['business', 'ai', 'startups'] (from interest picker)
// Falls back to business+tech+general if interests is empty
const fetchForYou = async (interests = []) => {
  // Build a list of query configs from the user's chosen interests
  const queryList = interests.length > 0
    ? interests
        .map(id => INTEREST_QUERY_MAP[id])
        .filter(Boolean)                       // skip unknown IDs
    : [                                        // fallback defaults
        INTEREST_QUERY_MAP.business,
        INTEREST_QUERY_MAP.technology,
        INTEREST_QUERY_MAP.general,
      ]

  // Fire all queries at the same time (parallel = faster)
  const results = await Promise.allSettled(queryList.map(q => fetchSingle(q)))
  const allRaw  = results.flatMap(r => r.status === 'fulfilled' ? r.value : [])

  // Clean, deduplicate, shuffle, limit to 12
  const unique = dedupe(allRaw)
  return shuffle(unique).slice(0, 12).map(formatArticle)
}

// ─── "Insights": all categories merged, shuffled ──────────────────────────────
const fetchInsights = async () => {
  const results = await Promise.allSettled(INSIGHTS_QUERIES.map(q => fetchSingle(q)))
  const allRaw  = results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
  const unique  = dedupe(allRaw)
  return shuffle(unique).slice(0, 20).map(formatArticle)
}

// ─── Main export ──────────────────────────────────────────────────────────────
// Called by useNews.js
// tab       = 'For You' | 'Markets' | 'Startups' | 'Tech' | 'Insights'
// interests = user preference array (only used for 'For You')
export const fetchNews = async (tab = 'For You', interests = []) => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('NO_API_KEY')
  }

  if (tab === 'For You')  return fetchForYou(interests)
  if (tab === 'Insights') return fetchInsights()

  const config = TAB_QUERY_MAP[tab]
  if (!config) return fetchForYou(interests)   // unknown tab → personalised feed

  const raw = await fetchSingle(config)
  return raw.map(formatArticle)
}

// ─── Sentiment score for MarketChart ─────────────────────────────────────────
export const getSentimentScore = (articles) => {
  if (!articles?.length) return 50
  const pos   = articles.filter(a => a.sentiment ===  1).length
  const neg   = articles.filter(a => a.sentiment === -1).length
  const score = 50 + ((pos - neg) / articles.length) * 40
  return Math.max(10, Math.min(95, Math.round(score)))
}
