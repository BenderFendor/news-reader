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

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
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
        const response = await fetch(`/api/fetchFeeds?feeds=${encodeURIComponent(JSON.stringify(feeds))}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        
        if (isMounted) {
          // Set articles directly to maintain consistent ordering
          setArticles(data.items)
          setErrors(data.errors || [])
          setIsDataReady(true)
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