"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Navigation from "./components/Navigation"
import NewsFeed from "./components/NewsFeed"
import GridView from "./components/GridView"
import AddFeedModal from "./components/AddFeedModal"
import SourcesList from "./components/SourcesList"
import DebugPanel from "./components/DebugPanel"
import { debounce } from "lodash"

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

/**
 * Home component that serves as the main page of the application
 * Manages state for feeds, view mode, modals, and current source
 */
export default function Home() {
  // Debug render count
  const renderCount = useRef(0)
  renderCount.current++
  console.log(`[Home] Rendering #${renderCount.current}`)

  // Main state variables
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "doomscroll">("grid")
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false)
  const [isSourcesListOpen, setIsSourcesListOpen] = useState(false)
  const [feedErrors, setFeedErrors] = useState<FeedError[]>([])
  const [, setIsLoading] = useState(false)
  const [currentSource, setCurrentSource] = useState<string>("")
  const [visibleSections, setVisibleSections] = useState<Record<string, number>>({})

  // Track source changes for debugging
  const sourceChangeHistory = useRef<Array<{time: number, source: string}>>([])

  /**
   * Create a debounced version of setCurrentSource to prevent rapid updates
   * while scrolling through different sections
   */
  const debouncedSetCurrentSource = useMemo(
    () => {
      console.log(`[Home] Creating debounced setCurrentSource function`)
      return debounce((source: string) => {
        const now = Date.now()
        sourceChangeHistory.current.push({time: now, source: source})
        if (sourceChangeHistory.current.length > 10) {
          sourceChangeHistory.current.shift() // Keep last 10 entries
        }
        
        console.log(`[Home] debouncedSetCurrentSource called with: "${source || "All Sources"}"`)
        console.log(`[Home] Source change history:`, sourceChangeHistory.current)
        
        setCurrentSource(prevSource => {
          console.log(`[Home] Updating currentSource state: "${prevSource}" -> "${source || "All Sources"}"`)
          return source || "All Sources"
        })
      }, 100)
    },
    []
  )

  /**
   * Load initial feeds on component mount
   */
  useEffect(() => {
    setFeeds(feed)
  }, [])

  /**
   * Add a new feed to the list
   */
  const addFeed = (url: string, category: string) => {
    const newFeed = { url, category }
    const updatedFeeds = [...feeds, newFeed]
    setFeeds(updatedFeeds)
    localStorage.setItem("rssFeeds", JSON.stringify(updatedFeeds))
  }

  /**
   * Remove a feed from the list
   */
  const removeFeed = (url: string) => {
    const updatedFeeds = feeds.filter((feed) => feed.url !== url)
    setFeeds(updatedFeeds)
    localStorage.setItem("rssFeeds", JSON.stringify(updatedFeeds))
  }

  /**
   * Fetch feeds from API and handle loading/error states
   */
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

  /**
   * Debug logging for current source changes
   */
  useEffect(() => {
    console.log("Debug: currentSource state updated to", currentSource)
  }, [currentSource])

  /**
   * Direct source change handler (non-debounced)
   */
  const handleSourceChange = (source: string) => {
    console.log(`[Home] Direct handleSourceChange called with: "${source}"`)
    debouncedSetCurrentSource(source)
  }

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
            onSourceChange={handleSourceChange}
            onVisibilityChange={(sections) => setVisibleSections(sections)}
          />
        ) : (
          <NewsFeed feeds={feeds} />
        )}
      </div>
      
      {/* Debug panel for development */}
      <DebugPanel 
        currentSource={currentSource} 
        visibleSections={visibleSections}
      />
      
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
        />
      )}
    </main>
  )
}

