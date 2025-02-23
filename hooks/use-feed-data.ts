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

interface FeedError {
  url: string
  error: string
}

interface UseFeedDataResult {
  articles: FeedItem[]
  errors: FeedError[]
  loading: boolean
  isDataReady: boolean
}

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

// Function to preload images
async function preloadImage(url: string): Promise<void> {
  if (imageCache.has(url)) return

  try {
    const img = new Image()
    img.src = url
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })
    imageCache.set(url, url)
  } catch (error) {
    console.error(`Failed to preload image: ${url}`, error)
    imageCache.set(url, '/placeholder.svg')
  }
}

export function useFeedData(feeds: { url: string; category: string }[]): UseFeedDataResult {
  const [articles, setArticles] = useState<FeedItem[]>([])
  const [errors, setErrors] = useState<FeedError[]>([])
  const [loading, setLoading] = useState(true)
  const [isDataReady, setIsDataReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchFeeds = async () => {
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

        const response = await fetch(`/api/fetchFeeds?feeds=${encodeURIComponent(JSON.stringify(feeds))}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        
        if (isMounted) {
          // Cache the articles
          articleCache.set(cacheKey, data.items)
          setArticles(data.items)
          setErrors(data.errors || [])
          setIsDataReady(true)

          // Preload images in the background
          data.items.forEach(async (article: FeedItem) => {
            if (article.enclosure?.url) {
              await preloadImage(article.enclosure.url)
            }
          })
        }
      } catch (error) {
        console.error("Error fetching feeds:", error)
        if (isMounted) {
          setErrors([{ url: "all", error: (error as Error).message }])
        }
      }
      if (isMounted) {
        setLoading(false)
      }
    }

    if (feeds.length > 0) {
      fetchFeeds()
    }

    return () => {
      isMounted = false
    }
  }, [feeds])

  return { articles, errors, loading, isDataReady }
}