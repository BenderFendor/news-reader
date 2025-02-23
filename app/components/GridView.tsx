"use client"

// Import necessary components and hooks
import { type FC, useEffect, useRef, useState } from "react"
import ArticleCard from "./ArticleCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFeedData } from "@/hooks/use-feed-data"
import styles from "./GridView.module.css"

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
  currentSource: string  // Global current source provided by parent
  onSourceChange?: (source: string) => void
}

// Main GridView component with snap scrolling functionality
const GridView: FC<GridViewProps> = ({ feeds, currentSource, onSourceChange }) => {
  const { articles, errors } = useFeedData(feeds)
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const [visibleCategory, setVisibleCategory] = useState<string | null>(null);

    useEffect(() => {
        // Update the source if it changes from the parent
        if (currentSource !== visibleCategory && currentSource) {
            setVisibleCategory(currentSource);
        }
    }, [currentSource]);


  // Function to log the category of the section that is scrolled into view
  const logVisibleCategory = (category: string) => {
    console.log("Scrolled into view category:", category)
  }

  // Intersection observer useEffect with debug logs
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0
        let mostVisibleCategory: string | null = null
        // Iterate through each entry and log their visibility ratios for debugging
        entries.forEach((entry) => {
          const category = entry.target.getAttribute("data-category")
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisibleCategory = category
          }
        })
        if (mostVisibleCategory && mostVisibleCategory !== visibleCategory) {
          setVisibleCategory(mostVisibleCategory);
          onSourceChange && onSourceChange(mostVisibleCategory)
          if (mostVisibleCategory) {
            logVisibleCategory(mostVisibleCategory) // Call the new function here
          }
        }
      },
      { threshold: [0.5] }
    )

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      observer.disconnect()
      sectionRefs.current.clear()
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
    <div 
      className={styles.gridView_container}
    >
      {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
        <div
          key={category}
          ref={(el) => {
            if (el) sectionRefs.current.set(category, el)
          }}
          data-category={category}
          className={styles.gridView_categorySection}
        >
          <div className={styles.gridView_categoryContainer}>
            <div className={styles.gridView_articleGrid}>
              {categoryArticles.map((article, index) => (
                <div
                  key={`${category}-${index}`}
                  className={styles.gridView_articleWrapper}
                >
                  <ArticleCard article={article} source={category} />
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
