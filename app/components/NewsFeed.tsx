"use client"

import { type FC, useState, useEffect } from "react"
import Article from "./Article"

interface NewsFeedProps {
  feeds: { url: string; category: string }[]
}

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

const NewsFeed: FC<NewsFeedProps> = ({ feeds }) => {
  const [articles, setArticles] = useState<FeedItem[]>([])
  const [errors, setErrors] = useState<FeedError[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        setArticles(data.items)
        setErrors(data.errors)
      } catch (error) {
        console.error("Error fetching feeds:", error)
        setErrors([{ url: "all", error: error.message }])
      }
      setLoading(false)
    }

    fetchFeeds()
  }, [feeds])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (errors.length > 0 && articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Error fetching feeds:</h2>
        <ul>
          {errors.map((error, index) => (
            <li key={index} className="text-red-500">
              {error.url}: {error.error}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll bg-gray-100 dark:bg-amoled">
      {articles.map((article, index) => (
        <div key={index} className="snap-start h-screen flex items-center justify-center">
          <Article article={article} isTikTokStyle />
        </div>
      ))}
    </div>
  )
}

export default NewsFeed

