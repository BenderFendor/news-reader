"use client"

import { type FC } from "react"
import Article from "./Article"
import { useFeedData } from "@/hooks/use-feed-data"

interface NewsFeedProps {
  feeds: { url: string; category: string }[]
}

const NewsFeed: FC<NewsFeedProps> = ({ feeds }) => {
  const { articles, errors } = useFeedData(feeds)

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

