"use client"

// Import necessary components and hooks
import { type FC, useEffect, useRef, useState } from "react"
import ArticleCard from "./ArticleCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFeedData } from "@/hooks/use-feed-data"

// Define interfaces for feed items and component props
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

interface GridViewProps {
  feeds: { url: string; category: string }[]
  onSourceChange?: (source: string) => void
}

// Main GridView component with snap scrolling functionality
const GridView: FC<GridViewProps> = ({ feeds, onSourceChange }) => {
  const { articles, errors, loading, isDataReady } = useFeedData(feeds)
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const category = entry.target.getAttribute('data-category')
            if (category && onSourceChange) {
              onSourceChange(category)
            }
          }
        })
      },
      {
        threshold: 0.5,
        root: null
      }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref)
      }
    })

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref)
        }
      })
    }
  }, [onSourceChange])

  // Handle empty feeds state
  if (feeds.length === 0) {
    return (
      <div className="container mx-auto px-4 h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No RSS Feeds Added</h2>
          <p className="text-gray-600 dark:text-gray-400">Click the "Add Feed" button to get started</p>
        </div>
      </div>
    )
  }

  // Handle loading state
  if (!isDataReady || loading) {
    return (
      <div className="container mx-auto px-4 h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (errors.length > 0 && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Error fetching feeds</h2>
        <ul className="space-y-2">
          {errors.map((error, index) => (
            <li key={index} className="text-red-500 bg-red-100 dark:bg-red-900/20 px-4 py-2 rounded">
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

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto snap-y snap-mandatory">
      {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
        <div 
          key={category} 
          ref={(el) => el && sectionRefs.current.set(category, el)}
          data-category={category}
          className="h-[calc(100vh-4rem)] w-full snap-start snap-always py-6 px-4"
        >
          <div className="container mx-auto h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full overflow-y-auto snap-y snap-mandatory">
              {categoryArticles.map((article, index) => (
                <div 
                  key={`${category}-${index}`} 
                  className="transform transition-transform duration-300 hover:scale-105 snap-start snap-always h-[320px]"
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GridView

