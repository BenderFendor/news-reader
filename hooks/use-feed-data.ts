import { useState, useEffect } from "react"

interface FeedItem {
  title: string
  link: string
  description: string
  pubDate: string
  enclosure?: {
    url: string
    type: string
  }
  source: string
  category: string
}

// Custom error types for different failure cases
class FetchError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'FetchError'
  }
}

class APIError extends Error {
  constructor(public details: unknown) {
    super(typeof details === 'string' ? details : 'API Error')
    this.name = 'APIError'
  }
}

interface FeedError {
  url: string
  error: string
  type: 'fetch' | 'api' | 'parse'
}

interface UseFeedDataResult {
  articles: FeedItem[]
  errors: FeedError[]
  loading: boolean
  isDataReady: boolean
}

type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E }

// Cache for storing fetched articles
const articleCache = new Map<string, FeedItem[]>()
const imageCache = new Map<string, string>()

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Function to preload images with proper error handling
async function preloadImage(url: string): Promise<Result<string, Error>> {
  if (imageCache.has(url)) {
    return { ok: true, value: imageCache.get(url)! }
  }

  try {
    const img = new Image()
    img.src = url
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    imageCache.set(url, url)
    return { ok: true, value: url }
  } catch (error) {
    console.error(`Failed to preload image: ${url}`, error)
    imageCache.set(url, '/placeholder.svg')
    return { 
      ok: false, 
      error: error instanceof Error ? error : new Error(`Failed to load image: ${url}`) 
    }
  }
}

async function fetchFeedData(feeds: { url: string; category: string }[]): Promise<Result<{
  items: FeedItem[],
  errors?: FeedError[]
}, Error>> {
  try {
    const response = await fetch(
      `/api/fetchFeeds?feeds=${encodeURIComponent(JSON.stringify(feeds))}`
    )

    if (!response.ok) {
      return {
        ok: false,
        error: new FetchError(
          response.status,
          `Failed to fetch feeds: ${response.statusText}`
        )
      }
    }

    const data = await response.json()

    if (data.error) {
      return {
        ok: false,
        error: new APIError(data.error)
      }
    }

    return { ok: true, value: data }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Unknown error during fetch')
    }
  }
}

export function useFeedData(feeds: { url: string; category: string }[]): UseFeedDataResult {
  const [articles, setArticles] = useState<FeedItem[]>([])
  const [errors, setErrors] = useState<FeedError[]>([])
  const [loading, setLoading] = useState(true)
  const [isDataReady, setIsDataReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const processFeedData = async () => {
      setLoading(true)
      
      try {
        // Generate cache key from feed URLs
        const cacheKey = feeds.map(f => f.url).sort().join(',')

        // Check cache first
        if (articleCache.has(cacheKey)) {
          const cachedArticles = articleCache.get(cacheKey)!
          if (isMounted) {
            setArticles(cachedArticles)
            setIsDataReady(true)
            setLoading(false)
            return
          }
        }

        const result = await fetchFeedData(feeds)

        if (!isMounted) return

        if (!result.ok) {
          setErrors([{
            url: 'all',
            error: result.error.message,
            type: result.error instanceof FetchError ? 'fetch' : 'api'
          }])
          setArticles([])
          return
        }

        // Cache the articles
        articleCache.set(cacheKey, result.value.items)
        setArticles(result.value.items)
        setErrors(result.value.errors || [])
        setIsDataReady(true)

        // Preload images in the background
        result.value.items.forEach(async (article: FeedItem) => {
          if (article.enclosure?.url) {
            await preloadImage(article.enclosure.url)
          }
        })
      } catch (error) {
        if (!isMounted) return
        
        console.error("Error in feed data processing:", error)
        setErrors([{ 
          url: "all", 
          error: error instanceof Error ? error.message : "Unknown error",
          type: 'parse'
        }])
        setArticles([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (feeds.length > 0) {
      processFeedData()
    }

    return () => {
      isMounted = false
    }
  }, [feeds])

  return { articles, errors, loading, isDataReady }
}