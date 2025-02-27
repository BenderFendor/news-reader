"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { ImageOffIcon } from "lucide-react"

type MediaContent = {
  url?: string
  type?: string
  "@_url"?: string
  "@_type"?: string
}

interface Article {
  title: string
  link: string
  description: string
  pubDate: string
  enclosure?: MediaContent
  "media:content"?: MediaContent
  source: string
  category: string
}

interface ArticleCardProps {
  article: Article
  source: string
}

type Result<T> = { success: true; data: T } | { success: false; error: Error }

/**
 * ArticleCard displays a news article in a card format optimized for AMOLED displays
 * @param article - The article data to display
 * @param source - The source name of the article
 */
const ArticleCard = ({ article, source }: ArticleCardProps) => {
  const [imageState, setImageState] = useState<Result<string | null>>({ 
    success: true, 
    data: null 
  })
  const [isLoading, setIsLoading] = useState(true)

  // Extract clean text from HTML description
  const cleanDescription = (() => {
    if (!article.description) return ""
    const div = document.createElement("div")
    div.innerHTML = article.description
    return div.textContent || div.innerText || ""
  })()

  // Format relative time with graceful fallback
  const formattedDate = (() => {
    try {
      return formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })
    } catch {
      return "Recently"
    }
  })()

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const mediaUrl = article.enclosure?.["@_url"] || 
                        article.enclosure?.url || 
                        article["media:content"]?.["@_url"]
        
        if (!mediaUrl) {
          setImageState({ success: true, data: null })
          setIsLoading(false)
          return
        }

        // Validate image before setting
        const response = await fetch(mediaUrl)
        if (!response.ok) throw new Error("Failed to load image")
        
        const contentType = response.headers.get("content-type")
        if (!contentType?.startsWith("image/")) {
          throw new Error("Invalid image type")
        }

        setImageState({ success: true, data: mediaUrl })
      } catch (error) {
        setImageState({ 
          success: false, 
          error: error instanceof Error ? error : new Error("Unknown error") 
        })
      } finally {
        setIsLoading(false)
      }
    }

    void fetchImage()
  }, [article])

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {isLoading ? (
          <div className={`${styles.imageContainer} ${styles.loading}`} />
        ) : imageState.success && imageState.data ? (
          <img
            src={imageState.data}
            alt=""
            className={styles.image}
            loading="lazy"
            aria-hidden="true"
          />
        ) : (
          <div className={styles.placeholder}>
            <ImageOffIcon className={styles.placeholderIcon} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.description}>{cleanDescription}</p>
        
        <div className={styles.metadata}>
          <span className={styles.source}>{source}</span>
          <time className={styles.date} dateTime={article.pubDate}>
            {formattedDate}
          </time>
        </div>
      </div>
      
      <a 
        href={article.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.link}
        aria-label={`Read full article: ${article.title}`}
      />
    </div>
  )
}

export default ArticleCard
