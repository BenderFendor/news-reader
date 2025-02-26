"use client"

import { type FC, useEffect, useState, useRef } from "react"
import { Grid2X2, ScrollText, Plus, List } from "lucide-react"

interface NavigationProps {
  viewMode: "grid" | "doomscroll"
  setViewMode: (mode: "grid" | "doomscroll") => void
  openAddFeedModal: () => void
  toggleSourcesList: () => void
  currentSource?: string
}

/**
 * Navigation component that displays the header bar with view mode controls,
 * source title, and action buttons.
 * Hides when scrolling down and shows when scrolling up.
 */
const Navigation: FC<NavigationProps> = ({ viewMode, setViewMode, openAddFeedModal, toggleSourcesList, currentSource }) => {
  // Debug render count
  const renderCount = useRef(0)
  renderCount.current++
  console.log(`[Navigation] Rendering #${renderCount.current}, currentSource="${currentSource}"`)
  
  // Track previous currentSource for debugging
  const prevSourceRef = useRef<string | undefined>("")
  
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(false)

  // Handle scroll events to hide/show the navigation bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 100)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Debug when currentSource prop changes
  useEffect(() => {
    if (prevSourceRef.current !== currentSource) {
      console.log(`[Navigation] currentSource prop changed: "${prevSourceRef.current}" -> "${currentSource}"`)
      prevSourceRef.current = currentSource
    }
  }, [currentSource])

  return (
    <nav className={`header fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 transition-transform duration-300 transform ${isScrollingDown ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="header-container container mx-auto px-4 py-3">
        <div className="header-content flex justify-between items-center relative">
          <h1 
            className="header-title absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-foreground/90 z-10 whitespace-nowrap transition-all duration-300"
            style={{ borderBottom: '2px solid transparent', paddingBottom: '2px' }}
          >
            <span
              key={currentSource} // Force re-render animation when source changes
              className="animate-fadeIn block"
            >
              {currentSource || "All Sources"}
            </span>
          </h1>
          <div className="header-view-mode flex items-center space-x-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`header-view-mode-button p-2 rounded-lg ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
              aria-label="Grid view"
            >
              <Grid2X2 size={24} />
            </button>
            <button
              onClick={() => setViewMode("doomscroll")}
              className={`header-view-mode-button p-2 rounded-lg ${viewMode === "doomscroll" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
              aria-label="doomscroll style view"
            >
              <ScrollText size={24} />
            </button>
          </div>
          <div className="header-actions flex items-center space-x-4">
            <button
              onClick={openAddFeedModal}
              className="header-action-button p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
              aria-label="Add feed"
            >
              <Plus size={24} />
            </button>
            <button
              onClick={toggleSourcesList}
              className="header-action-button p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
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

