"use client"

import type React from "react"

import { type FC, useState } from "react"
import { X } from "lucide-react"

interface AddFeedModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFeed: (url: string, category: string) => void
}

const AddFeedModal: FC<AddFeedModalProps> = ({ isOpen, onClose, onAddFeed }) => {
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url && category) {
      onAddFeed(url, category)
      setUrl("")
      setCategory("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-serif">Add RSS Feed</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium mb-1">
              RSS Feed URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 rounded border bg-input text-foreground"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded border bg-input text-foreground"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Add Feed
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddFeedModal

