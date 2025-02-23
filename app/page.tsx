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
      />
      <div className="flex-1 mt-16">
        {viewMode === "grid" ? <GridView feeds={feeds} /> : <NewsFeed feeds={feeds} />}
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

