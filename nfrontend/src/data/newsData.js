// ─── Mock News Data ──────────────────────────────────────────────────────────
// This is fake/demo data. In a real app, you'd fetch this from a news API.

export const newsArticles = [
  {
    id: 1,
    title: 'Tata Motors Surges 8% on Record EV Sales',
    description:
      'Tata Motors stock jumped 8% after reporting record electric vehicle sales in Q3, beating analyst expectations by a wide margin.',
    whyItMatters:
      'EV market momentum in India is accelerating — investors are watching the sector closely.',
    tags: ['Finance', 'EV Markets'],
    urgency: 'High',
    category: 'Markets',
    glow: 'green',
    gradient: 'from-emerald-900/60 to-teal-900/30',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(16,220,138,0.15)',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=80',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'RBI Hikes Interest Rates by 0.5%',
    description:
      'The Reserve Bank of India raised interest rates by 50 basis points to combat rising inflation, marking the third hike this fiscal year.',
    whyItMatters:
      'Borrowing costs are rising sharply — home loans and business credit will become more expensive.',
    tags: ['Finance', 'Economy'],
    urgency: 'High',
    category: 'Markets',
    glow: 'red',
    gradient: 'from-red-900/60 to-rose-900/30',
    borderColor: 'border-red-500/30',
    glowColor: 'rgba(255,77,109,0.15)',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80',
    time: '4 hours ago',
  },
  {
    id: 3,
    title: 'Startup Raises $20M in Series A',
    description:
      'A Bengaluru-based fintech startup secured $20 million in Series A funding led by Tiger Global, planning rapid expansion into Southeast Asia.',
    whyItMatters:
      'Expansion plans are now in motion — India\'s startup ecosystem continues to attract global VC capital.',
    tags: ['Startup', 'Funding'],
    urgency: 'Medium',
    category: 'Startups',
    glow: 'amber',
    gradient: 'from-amber-900/40 to-orange-900/20',
    borderColor: 'border-amber-500/20',
    glowColor: 'rgba(255,179,71,0.10)',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
    time: '6 hours ago',
  },
  {
    id: 4,
    title: 'Meta Launches AI-Powered Ad Engine',
    description:
      'Meta unveiled its next-generation AI advertising engine that promises 30% better conversion rates, posing a direct challenge to Google Ads.',
    whyItMatters:
      'Digital advertising is being radically reshaped by AI — businesses need to adapt their marketing strategies.',
    tags: ['Tech', 'AI'],
    urgency: 'Medium',
    category: 'Tech',
    glow: 'blue',
    gradient: 'from-blue-900/50 to-indigo-900/30',
    borderColor: 'border-blue-500/25',
    glowColor: 'rgba(42,165,255,0.12)',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
    time: '8 hours ago',
  },
  {
    id: 5,
    title: 'Sensex Crosses 80,000 Mark for First Time',
    description:
      'The BSE Sensex crossed the historic 80,000 mark for the first time ever, driven by strong FII inflows and positive global sentiment.',
    whyItMatters:
      'A milestone in Indian market history — retail investors are seeing strong portfolio gains.',
    tags: ['Markets', 'Stocks'],
    urgency: 'High',
    category: 'Markets',
    glow: 'green',
    gradient: 'from-emerald-900/50 to-green-900/25',
    borderColor: 'border-emerald-500/25',
    glowColor: 'rgba(16,220,138,0.12)',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
    time: '1 hour ago',
  },
]

// ─── Mock AI Chat Responses ────────────────────────────────────────────────
export const aiResponses = {
  default: [
    "Based on today's market data, **Indian equities are showing strong momentum**, with Sensex up 1.2% and Nifty gaining 0.9%. The rally is driven by strong FII inflows and positive global cues from Fed rate pause signals.",
    "The **EV sector** is seeing explosive growth in India. Tata Motors leads the charge with 68% market share in domestic EV sales. Analysts project the sector to grow 45% YoY through 2026.",
    "**RBI's rate hike** will have cascading effects: home loan EMIs will rise ₹850-1200 for every ₹50L loan, NBFCs may face margin pressure, and bond yields could spike 15-20 bps in the short term.",
    "Today's **startup funding** highlights Bengaluru and Mumbai as top hubs. Total VC investment in Indian startups this quarter stands at $2.3B — 18% higher than last year's same period.",
    "The **global tech sell-off** seen last week appears to be stabilizing. NASDAQ futures are up 0.6%. AI-related stocks continue to outperform, with the sector up 28% YTD vs S&P 500's 14%.",
  ]
}

// ─── Category tabs ─────────────────────────────────────────────────────────
export const tabs = ['For You', 'Markets', 'Startups', 'Tech']

// ─── Filter articles by tab ─────────────────────────────────────────────────
export const filterByTab = (articles, tab) => {
  if (tab === 'For You') return articles
  return articles.filter(a => a.category === tab)
}
