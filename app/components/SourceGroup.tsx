"use client"

import type React from "react"
import { useState } from "react"
import Article from "./Article"
import { ChevronDown, ChevronUp } from "lucide-react"

interface SourceGroupProps {
  source: string
  articles: any[]
}

const SourceGroup: React.FC<SourceGroupProps> = ({ source, articles }) => {
  const [expanded, setExpanded] = useState(false)
  const displayedArticles = expanded ? articles : articles.slice(0, 5)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{source}</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
        >
          {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ${expanded ? "" : "max-h-[800px] overflow-hidden"}`}
      >
        {displayedArticles.map((article, index) => (
          <Article key={index} article={article} isGridView />
        ))}
      </div>
      {!expanded && articles.length > 5 && (
        <div className="text-center p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Show {articles.length - 5} more articles
          </button>
        </div>
      )}
    </div>
  )
}

export default SourceGroup

