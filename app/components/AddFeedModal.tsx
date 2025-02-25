"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

interface AddFeedModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFeed: (url: string, category: string) => void
}

/**
 * AddFeedModal component that allows users to add new RSS feeds
 * Displays a modal with form fields for URL and category
 */
const AddFeedModal = ({ isOpen, onClose, onAddFeed }: AddFeedModalProps) => {
  // State for form fields
  const [feedUrl, setFeedUrl] = useState("")
  const [category, setCategory] = useState("")
  const [error, setError] = useState<string | null>(null)
  
  // Reference to the modal container for handling outside clicks
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Reference to focus on input when modal opens
  const urlInputRef = useRef<HTMLInputElement>(null)
  
  // Focus on the URL input field when the modal opens
  useEffect(() => {
    if (isOpen && urlInputRef.current) {
      setTimeout(() => {
        urlInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  /**
   * Close modal when clicking outside of it
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  /**
   * Handle adding a new feed
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate URL
    if (!feedUrl) {
      setError("Please enter a feed URL")
      return
    }
    
    try {
      new URL(feedUrl) // Validate URL format
      
      // If category is empty, use the host name from the URL
      const finalCategory = category.trim() || new URL(feedUrl).hostname
      
      onAddFeed(feedUrl, finalCategory)
      setFeedUrl("")
      setCategory("")
      onClose()
      
    } catch (err) {
      setError("Please enter a valid URL")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-background/95 backdrop-blur-md rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-xl border border-gray-800/40"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800/40">
          <h2 className="text-xl font-semibold text-primary">Add RSS Feed</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800/40 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="feed-url" 
              className="block text-sm font-medium text-gray-300"
            >
              Feed URL
            </label>
            <input
              ref={urlInputRef}
              id="feed-url"
              type="text"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              placeholder="https://example.com/rss"
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </div>
          
          <div className="space-y-2">
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-300"
            >
              Category <span className="text-gray-500">(optional)</span>
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="News, Technology, etc."
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
            />
            <p className="text-xs text-gray-500 italic">
              If left empty, the domain name will be used
            </p>
          </div>
          
          {error && (
            <div className="text-red-500 bg-red-950/20 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-700 hover:bg-gray-800/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              Add Feed
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFeedModal

