Okay, I will analyze the provided codebase and refactor it to address your requirements. This will involve several steps, including:

Modifying GridView and Navigation to dynamically update the title. I'll make GridView responsible for communicating the current source (category) to the parent component, which then updates the Navigation title.

Removing the Image Fetching from Article I'll remove the logic that fetches images from the URLs and use only the image that comes directly from the feed and set a placeholder if the image doesn't render

Removing the loading indicator and updating the Gridview so cards pop up

Code Cleanup and Optimization: Streamlining components for readability and performance.

Here's the plan, and I'll provide the code changes incrementally:

1. Updated GridView.tsx

"use client"

// Import necessary components and hooks
import { type FC, useEffect, useRef } from "react"
import ArticleCard from "./ArticleCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFeedData } from "@/hooks/use-feed-data"
import styles from "./GridView.module.css"
import { useState } from "react"

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
content_copy
download
Use code with caution.
TypeScript

Key changes:

visibleCategory state: Added a state variable visibleCategory to track the currently visible category within GridView.

useEffect to update the source if it changes from the parent: Updated the useEffect to set the visible category from parent

IntersectionObserver Updates: Instead of calling onSourceChange right away, the changes now call the setVisible category which will call the onSourceChange Function.

Removed Scroll Handler: Removed scroll handler

2. Updated ArticleCard.tsx

import { type FC } from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { decode } from "html-entities"
import styles from "./ArticleCard.module.css"

interface ArticleCardProps {
  article: {
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
  source: string
}

const ArticleCard: FC<ArticleCardProps> = ({ article, source }) => {
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg")
  useEffect(() => {
    let imageSrc = "/placeholder.svg"
    if (article.enclosure?.url && article.enclosure.type?.startsWith("image/")) {
      imageSrc = article.enclosure.url
    } else if (article.enclosure?.["@_url"] && article.enclosure?.["@_type"]?.startsWith("image/")) {
      imageSrc = article.enclosure["@_url"]
    } else if (article["media:content"]?.["@_url"] && article["media:content"]?.["@_type"]?.startsWith("image/")) {
      imageSrc = article["media:content"]["@_url"]
    }
    setImageUrl(imageSrc)
  }, [article])

  const decodedTitle = decode(article.title)
  const decodedDescription = typeof article.description === 'string' ? decode(article.description) : ''

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "")
  }

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div className={styles.articleCard_container}>
        <div className={styles.articleCard_imageContainer}>
          <Image
            src={imageUrl}
            alt={decodedTitle}
            fill
            className={styles.articleCard_image}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
        </div>
        <div className={styles.articleCard_content}>
          <div className={styles.articleCard_source}>{source}</div>
          <h3 className={styles.articleCard_title}>
            {decodedTitle}
          </h3>
          <p className={styles.articleCard_description}>
            {stripHtml(decodedDescription)}
          </p>
        </div>
      </div>
    </a>
  )
}

export default ArticleCard
content_copy
download
Use code with caution.
TypeScript

Key changes:

Removed Image Fetching: Remove the image url cache and fetching.

Set state with the image src from article

3. Update app/page.tsx

"use client"

import { useState, useEffect } from "react"
import Navigation from "./components/Navigation"
import NewsFeed from "./components/NewsFeed"
import GridView from "./components/GridView"
import AddFeedModal from "./components/AddFeedModal"
import SourcesList from "./components/SourcesList"

interface Feed {
  url: string
  category: string
}

interface FeedError {
  url: string
  error: string
}

const feed: Feed[] = [
  { url: "https://972mag.com/feed/", category: "972mag.com" },
  { url: "https://ngo-monitor.org/feed/", category: "ngo_monitor.org" },
  { url: "http://www.npr.org/rss/rss.php?id=1001", category: "NPR" },
  { url: "https://truthout.org/feed/", category: "Truth Out" },
  { url: "https://apnews.com/rss/topnews", category: "The Associated Press" },
  { url: "https://rss.cnn.com/rss/cnn_topstories.rss", category: "CNN" },
  { url: "https://www.psychologytoday.com/intl/rss", category: "Psychology Today" },
  { url: "https://www.reuters.com/tools/rss", category: "Reuters" },
  { url: "https://novaramedia.com/feed/", category: "Novara Media" },
  { url: "https://www.democracynow.org/democracynow.rss", category: "Democracy Now!" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", category: "The New York Times" },
  { url: "https://feeds.a.dj.com/rss/RSSWorldNews.xml", category: "The Wall Street Journal" },
  { url: "https://monthlyreview.org/feed/", category: "Monthly Review" },
  { url: "https://bigthink.com/feed/", category: "Big Think" },
  { url: "https://beautifulpixels.com/feed/", category: "Beautiful Pixels" },
  { url: "https://www.nationalgeographic.com/rss/daily-news", category: "National Geographic" },
  { url: "https://www.wsws.org/en/rss.xml", category: "WSWS" },
  { url: "https://www.counterpunch.org/feed/", category: "CounterPunch" },
  { url: "https://www.project-syndicate.org/rss", category: "Project Syndicate" },
  { url: "https://japantoday.com/rss", category: "Japan Today" },
  { url: "https://www.japantimes.co.jp/feed/", category: "The Japan Times" },
  { url: "https://www.epicbundle.com/rss-feed-how-to/", category: "Epic Bundle" },
  { url: "https://feed.phenx.de/lootscraper_epic_game.xml", category: "Epic Games Deals" },
  { url: "https://feed.phenx.de/lootscraper.xml", category: "Game Deals" },
]

export default function Home() {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "tiktok">("grid")
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false)
  const [isSourcesListOpen, setIsSourcesListOpen] = useState(false)
  const [feedErrors, setFeedErrors] = useState<FeedError[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSource, setCurrentSource] = useState<string>("All Sources")

  useEffect(() => {
    setFeeds(feed)
  }, [])

  const addFeed = (url: string, category: string) => {
    const newFeed = { url, category }
    const updatedFeeds = [...feeds, newFeed]
    setFeeds(updatedFeeds)
    localStorage.setItem("rssFeeds", JSON.stringify(updatedFeeds))
  }

  const removeFeed = (url: string) => {
    const updatedFeeds = feeds.filter((feed) => feed.url !== url)
    setFeeds(updatedFeeds)
    localStorage.setItem("rssFeeds", JSON.stringify(updatedFeeds))
  }

  // Set loading and error states whenever feeds are fetched
  useEffect(() => {
    const fetchFeeds = async () => {
      setIsLoading(true)
      setFeedErrors([])
      try {
        const response = await fetch(`/api/fetchFeeds?feeds=${encodeURIComponent(JSON.stringify(feeds))}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.errors?.length) {
          setFeedErrors(data.errors)
        }
      } catch (error) {
        console.error("Error fetching feeds:", error)
        setFeedErrors([{ url: "all", error: (error as Error).message }])
      } finally {
        setIsLoading(false)
      }
    }

    if (feeds.length > 0) {
      fetchFeeds()
    }
  }, [feeds])

  return (
    <main className="min-h-screen bg-amoled flex flex-col">
      <Navigation
        viewMode={viewMode}
        setViewMode={setViewMode}
        openAddFeedModal={() => setIsAddFeedModalOpen(true)}
        toggleSourcesList={() => setIsSourcesListOpen(!isSourcesListOpen)}
        currentSource={currentSource}
      />
      <div className="flex-1 mt-16">
        {viewMode === "grid" ? (
          <GridView
            feeds={feeds}
            currentSource={currentSource}
            onSourceChange={(source) => {
              setCurrentSource(source)
            }}
          />
        ) : (
          <NewsFeed feeds={feeds} />
        )}
      </div>
      <AddFeedModal 
        isOpen={isAddFeedModalOpen} 
        onClose={() => setIsAddFeedModalOpen(false)} 
        onAddFeed={addFeed} 
      />
      {isSourcesListOpen && (
        <SourcesList 
          feeds={feeds} 
          onClose={() => setIsSourcesListOpen(false)} 
          onRemoveFeed={removeFeed} 
          errors={feedErrors}
          loading={isLoading}
        />
      )}
    </main>
  )
}
content_copy
download
Use code with caution.
TypeScript

Remove loading state: Removed the loading state from the page.

Removed loading indicator from feed data