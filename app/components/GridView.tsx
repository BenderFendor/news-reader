"use client"

import { type FC, useState, useEffect } from "react"
import ArticleCard from "./ArticleCard"

interface GridViewProps {
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

const GridView: FC<GridViewProps> = ({ feeds }) => {
  const [articles, setArticles] = useState<FeedItem[]>([])
  const [errors, setErrors] = useState<FeedError[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

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
        setErrors([{ url: "all", error: (error as Error).message }])
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

  // Group articles by category
  const groupedArticles = articles.reduce(
    (acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = []
      }
      acc[article.category].push(article)
      return acc
    },
    {} as Record<string, FeedItem[]>,
  )

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category],
    )
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
          <div key={category} className="mb-4">
            <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
              {category}
            </h2>
            <div className="h-[660px] overflow-y-auto pr-2 snap-y snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryArticles.map((article, index) => (
                  <div key={index} className="h-[320px] snap-start">
                    <ArticleCard key={index} article={article} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GridView

