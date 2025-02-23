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
  onSourceChange?: (source: string) => void
}

// Main GridView component with snap scrolling functionality
const GridView: FC<GridViewProps> = ({ feeds, onSourceChange }) => {
  const { articles, errors, loading, isDataReady } = useFeedData(feeds)
  // Create a ref to store references to category sections for intersection observation
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  // Track the currently visible category to prevent redundant updates
  const [currentlyVisibleCategory, setCurrentlyVisibleCategory] = useState<string | null>(null)

  useEffect(() => {
    // Create an intersection observer to track which category section is most visible
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleCategory = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleCategory = entry.target.getAttribute('data-category');
          }
        });

        // Update only if we have a most visible category and it's different from current
        if (mostVisibleCategory && mostVisibleCategory !== currentlyVisibleCategory) {
          setCurrentlyVisibleCategory(mostVisibleCategory);
          if (onSourceChange) {
            onSourceChange(mostVisibleCategory);
          }
        }
      },
      {
        // Use multiple thresholds for smoother detection
        threshold: [0, 0.25, 0.5, 0.75, 1],
        root: null,
        rootMargin: "-10% 0px -10% 0px" // Add margin to improve detection accuracy
      }
    );

    // Observe all category sections
    sectionRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    // Cleanup observer when component unmounts
    return () => {
      observer.disconnect();
      sectionRefs.current.clear();
    };
  }, [onSourceChange, currentlyVisibleCategory]); // Include currentlyVisibleCategory in dependencies

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
    <div className={styles.gridView_container}>
      {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
        <div
          key={category}
          ref={(el) => {
            if (el) {
              sectionRefs.current.set(category, el);
            }
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
