"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import styles from "./ArticleCard.module.css"
import { ImageOffIcon } from "lucide-react"

interface ArticleProps {
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

/**
 * ArticleCard component displays a single article with image and metadata
 * Optimized for dark theme with improved text contrast
 */
const ArticleCard = ({ article, source }: ArticleProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  // Format the publication date to relative time (e.g., "2 hours ago")
  const formattedDate = formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })
  
  /**
   * Extract clean text from HTML in description
   * Safely handles cases where description might not be a string
   */
  const cleanDescription = (() => {
    // Check if description exists
    if (!article.description) {
      return "No description available"
    }
    
    // Handle case where description is a string
    if (typeof article.description === 'string') {
      return article.description.replace(/<[^>]*>/g, '')
    }
    
    // Handle case where description is an object (might have a toString method)
    try {
      const stringValue = String(article.description)
      return stringValue.replace(/<[^>]*>/g, '')
    } catch (e) {
      return "No description available"
    }
  })()
  
  // Get image from article or fetch from our API
  useEffect(() => {
    const getImageForArticle = async () => {
      setIsLoading(true)
      
      // First try to get image from article metadata
      const mediaUrl = 
        article.enclosure?.url || 
        article.enclosure?.["@_url"] || 
        article["media:content"]?.["@_url"]
        
      if (mediaUrl) {
        setImageUrl(mediaUrl)
        setIsLoading(false)
        return
      }
      
      // If no direct image, fetch using our image extraction API
      try {
        const response = await fetch(`/api/fetchArticleImage?url=${encodeURIComponent(article.link)}`)
        const data = await response.json()
        
        if (data.imageUrl) {
          setImageUrl(data.imageUrl)
        } else {
          setImageError(true)
        }
      } catch (error) {
        console.error("Error fetching article image:", error)
        setImageError(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    getImageForArticle()
  }, [article.enclosure, article.link, article["media:content"]])

  return (
    <div className={styles.articleCard}>
      <div className={`${styles.imageContainer} ${isLoading ? styles.loading : ''}`}>
        {!isLoading && !imageError && imageUrl ? (
          <img 
            src={imageUrl} 
            alt={article.title}
            className={styles.image}
            onError={() => setImageError(true)}
          />
        ) : imageError ? (
          <div className={styles.placeholder}>
            <ImageOffIcon size={24} className={styles.placeholderIcon} />
          </div>
        ) : null}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.description}>{cleanDescription}</p>
        
        <div className={styles.metadata}>
          <span className={styles.source}>{source}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
      
      {/* Clickable overlay for the entire card */}
      <a 
        href={article.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.link}
        aria-label={article.title}
      />
    </div>
  )
}

export default ArticleCard
