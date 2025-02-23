"use client"

import { type FC, useEffect, useState } from "react"
import { Grid2X2, ScrollText, Plus, List } from "lucide-react"

interface NavigationProps {
  viewMode: "grid" | "tiktok"
  setViewMode: (mode: "grid" | "tiktok") => void
  openAddFeedModal: () => void
  toggleSourcesList: () => void
  currentSource?: string
}

const Navigation: FC<NavigationProps> = ({ viewMode, setViewMode, openAddFeedModal, toggleSourcesList, currentSource = "Scoop" }) => {
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 100)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 transition-transform duration-300 transform ${isScrollingDown ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center relative">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold">{currentSource}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
              aria-label="Grid view"
            >
              <Grid2X2 size={24} />
            </button>
            <button
              onClick={() => setViewMode("tiktok")}
              className={`p-2 rounded-lg ${viewMode === "tiktok" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
              aria-label="TikTok style view"
            >
              <ScrollText size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={openAddFeedModal}
              className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
              aria-label="Add feed"
            >
              <Plus size={24} />
            </button>
            <button
              onClick={toggleSourcesList}
              className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
              aria-label="View sources"
            >
              <List size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

