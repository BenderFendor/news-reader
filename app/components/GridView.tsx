"use client"

import { type FC, useEffect, useRef, useState, useLayoutEffect } from "react"
import ArticleCard from "./ArticleCard"
import { useFeedData } from "@/hooks/use-feed-data"
import styles from "./GridView.module.css"  // Import the CSS module

// Define interfaces for feed items and component props
interface FeedItem {
  title: string
  link: string
  description: string
  pubDate: string
  enclosure?: {
    url?: string
    type?: string
    "@_url"?: string
    "@_type"?: string
  }
  "media:content"?: {
    "@_url"?: string
    "@_type"?: string
  }
  source: string
  category: string
}

interface GridViewProps {
  feeds: { url: string; category: string }[]
  currentSource: string
  onSourceChange?: (source: string) => void
  onVisibilityChange?: (sections: Record<string, number>) => void
}

/**
 * GridView component that displays articles in a grid layout organized by category
 * Uses Intersection Observer to detect which category is currently most visible
 */
const GridView: FC<GridViewProps> = ({ feeds, currentSource, onSourceChange, onVisibilityChange }) => {
  const { articles, errors } = useFeedData(feeds)
  
  // Debug render count to trace component lifecycle
  const renderCount = useRef(0)
  renderCount.current++
  console.log(`[GridView] Rendering #${renderCount.current}, currentSource=${currentSource}`)
  
  // Map to store references to each category section DOM element
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  
  // State to track which category is currently most visible in the viewport
  const [visibleCategory, setVisibleCategory] = useState<string | null>(null)

  // Setup intersection observer to track which categories are visible
  useEffect(() => {
    // Skip if no articles or no sections
    if (articles.length === 0) {
      console.log(`[GridView] No articles to observe`)
      return
    }

    console.log(`[GridView] Setting up intersection observer, current visible: ${visibleCategory}`)

    // Create an intersection observer to detect which sections are visible
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(`[GridView] Intersection observed: ${entries.length} entries`)
        
        // Find the section with highest visibility ratio
        let maxRatio = 0
        let mostVisibleCategory: string | null = null
        
        // Collect visibility information for debug panel
        const visibilityInfo: Record<string, number> = {}
        
        // Debug all entries to see what's being observed
        entries.forEach((entry) => {
          const category = entry.target.getAttribute("data-category") || "unknown"
          console.log(`[GridView] Category: ${category}, visibility: ${entry.intersectionRatio.toFixed(2)}, isIntersecting: ${entry.isIntersecting}`)
          
          // Store visibility data for debug panel
          visibilityInfo[category] = entry.intersectionRatio
          
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisibleCategory = category
          }
        })
        
        // Report visibility changes to parent component
        if (onVisibilityChange) {
          onVisibilityChange(visibilityInfo)
        }
        
        console.log(`[GridView] Max ratio: ${maxRatio.toFixed(2)}, most visible: ${mostVisibleCategory}, current: ${visibleCategory}`)
        
        // Only update if we have a category with significant visibility that's different from current
        if (mostVisibleCategory && maxRatio > 0.1 && mostVisibleCategory !== visibleCategory) {
          console.log(`[GridView] UPDATING visible category to: ${mostVisibleCategory}`)
          setVisibleCategory(mostVisibleCategory)
          
          if (onSourceChange) {
            console.log(`[GridView] Calling onSourceChange with: ${mostVisibleCategory}`)
            onSourceChange(mostVisibleCategory)
          } else {
            console.log(`[GridView] WARNING: onSourceChange is undefined`)
          }
        } else if (maxRatio < 0.05 && visibleCategory !== null) {
          // If nothing is significantly visible, show "All Sources"
          console.log(`[GridView] Nothing significantly visible, resetting to All Sources`)
          setVisibleCategory(null)
          
          if (onSourceChange) {
            console.log(`[GridView] Calling onSourceChange with empty string`)
            onSourceChange("")
          } else {
            console.log(`[GridView] WARNING: onSourceChange is undefined`)
          }
        } else {
          console.log(`[GridView] No change in visible category needed`)
        }
      },
      { 
        // Use more granular thresholds to better detect partial visibility
        threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5],
        // Adjust for header height
        rootMargin: "-70px 0px -10% 0px"
      }
    )

    // Log the current refs we have
    console.log(`[GridView] Current section refs: ${sectionRefs.current.size}`)
    sectionRefs.current.forEach((_, category) => {
      console.log(`[GridView] - Section ref for: ${category}`)
    })

    // Observe all category sections
    sectionRefs.current.forEach((section, category) => {
      if (section) {
        console.log(`[GridView] Starting observation for section: ${category}`)
        observer.observe(section)
      } else {
        console.log(`[GridView] ERROR: Null ref for category: ${category}`)
      }
    })

    // Cleanup function
    return () => {
      console.log(`[GridView] Cleaning up observer`)
      observer.disconnect()
    }
  }, [articles.length, onSourceChange, visibleCategory, onVisibilityChange])

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

  console.log(`[GridView] Rendering ${Object.keys(groupedArticles).length} categories`)

  return (
    <div className={styles.gridView_container}>
      {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
        <div
          key={category}
          ref={(el) => {
            if (el) {
              console.log(`[GridView] Setting ref for ${category}`)
              sectionRefs.current.set(category, el)
            } else if (sectionRefs.current.has(category)) {
              console.log(`[GridView] Removing ref for ${category}`)
              sectionRefs.current.delete(category)
            }
          }}
          data-category={category}
          id={`category-${category}`}
          className={styles.gridView_categorySection}
        >
          <div className={styles.gridView_categoryContainer}>
            {/* No extra space or headers here */}
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
