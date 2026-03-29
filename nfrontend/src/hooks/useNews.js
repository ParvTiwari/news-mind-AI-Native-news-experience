// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useNews.js  (v2 — now accepts userInterests for personalised feed)
//
// Usage:
//   const { articles, loading, error, refresh } = useNews('For You', interests)
//   const { articles, loading }                 = useNews('Tech')
//   const { articles, loading }                 = useNews('Insights')
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchNews, getSentimentScore }              from '../api/news'
import { newsArticles as FALLBACK_DATA }             from '../data/newsData'

const REFRESH_INTERVAL_MS = 60_000   // auto-refresh every 60 seconds

// interests is an array like ['business','ai'] — only matters for 'For You' tab
export function useNews(tab = 'For You', interests = []) {
  const [articles,       setArticles]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState(null)
  const [lastUpdated,    setLastUpdated]    = useState(null)
  const [sentimentScore, setSentimentScore] = useState(50)
  const [usingFallback,  setUsingFallback]  = useState(false)
  const intervalRef = useRef(null)

  // Stable string version of interests for useCallback dependency
  // (arrays are not stable references, strings are)
  const interestsKey = interests.join(',')

  const load = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true)
    setError(null)

    try {
      // Pass both tab and interests to fetchNews
      const interestsArr = interestsKey ? interestsKey.split(',') : []
      const data = await fetchNews(tab, interestsArr)
      setArticles(data)
      setSentimentScore(getSentimentScore(data))
      setLastUpdated(new Date())
      setUsingFallback(false)
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        // No key set → silently show demo data
        setArticles(FALLBACK_DATA)
        setSentimentScore(getSentimentScore(FALLBACK_DATA))
        setUsingFallback(true)
        setError(null)
      } else {
        setError(err.message || 'Failed to load news')
        if (articles.length === 0) {
          setArticles(FALLBACK_DATA)
          setUsingFallback(true)
        }
      }
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, interestsKey])

  useEffect(() => {
    load(true)

    // Auto-refresh every 60 seconds
    intervalRef.current = setInterval(() => load(false), REFRESH_INTERVAL_MS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [load])

  return {
    articles,
    loading,
    error,
    lastUpdated,
    sentimentScore,
    usingFallback,
    refresh: () => load(true),
  }
}
