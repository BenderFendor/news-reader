"use client"

import type React from "react"

import { type FC, useState } from "react"

interface RSSFeedManagerProps {
  addFeed: (feed: string) => void
}

const RSSFeedManager: FC<RSSFeedManagerProps> = ({ addFeed }) => {
  const [newFeed, setNewFeed] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFeed.trim()) {
      addFeed(newFeed.trim())
      setNewFeed("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-gray-800">
      <div className="flex space-x-2">
        <input
          type="url"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
          placeholder="Enter RSS feed URL"
          className="flex-grow p-2 rounded border dark:bg-gray-700 dark:text-white"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Feed
        </button>
      </div>
    </form>
  )
}

export default RSSFeedManager

