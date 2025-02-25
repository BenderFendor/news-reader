"use client"

import { useEffect, useState } from "react"

interface DebugPanelProps {
  currentSource: string
  visibleSections?: Record<string, number>
}

/**
 * Debug panel to display current state information
 * Only visible in development mode
 */
const DebugPanel: React.FC<DebugPanelProps> = ({ currentSource, visibleSections = {} }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Toggle visibility with key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        setIsVisible(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="mb-2">
        <strong>Current Source:</strong> "{currentSource || "All Sources"}"
      </div>
      <div>
        <strong>Visible Sections:</strong>
        <ul className="mt-1">
          {Object.entries(visibleSections).map(([section, ratio]) => (
            <li key={section}>
              {section}: {ratio.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Press Ctrl+D to hide
      </div>
    </div>
  )
}

export default DebugPanel
