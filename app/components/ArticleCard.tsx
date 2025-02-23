import { type FC, useRef, useEffect } from "react"
import { useState } from "react"
import Image from "next/image"
import { decode } from "html-entities"
import styles from "./ArticleCard.module.css"

interface ArticleCardProps {
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
  source: string; // Add source prop
}

const ArticleCard: FC<ArticleCardProps> = ({ article, source }) => {
  const [fallbackImage, setFallbackImage] = useState<string | null>(null)
  const cardRef = useRef<HTMLAnchorElement>(null);

  const getImageUrl = async () => {
    try {
      // Try the RSS feed image sources first
      if (article.enclosure?.url && article.enclosure.type?.startsWith("image/")) {
        return article.enclosure.url
      }
      if (article.enclosure?.["@_url"] && article.enclosure?.["@_type"]?.startsWith("image/")) {
        return article.enclosure["@_url"]
      }
      if (article["media:content"]?.["@_url"] && article["media:content"]?.["@_type"]?.startsWith("image/")) {
        return article["media:content"]["@_url"]
      }

      // More careful handling of description parsing
      const description = article.description
      if (description && typeof description === 'string') {
        try {
          const imgMatch = description.match(/<img[^>]+src="([^"]+)"/)
          if (imgMatch && imgMatch[1]) {
            return imgMatch[1]
          }
        } catch (e) {
          console.error('Error parsing description for images:', e)
        }
      }

      // If no image found in RSS, try fetching from article
      if (!fallbackImage) {
        const response = await fetch(`/api/fetchArticleImage?url=${encodeURIComponent(article.link)}`)
        const data = await response.json()
        if (data.imageUrl) {
          setFallbackImage(data.imageUrl)
          return data.imageUrl
        }
      }

      return fallbackImage || "/placeholder.svg"
    } catch (error) {
      console.error('Error in getImageUrl:', error)
      return "/placeholder.svg"
    }
  }

  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg")

  useEffect(() => {
    getImageUrl().then(url => setImageUrl(url))
  }, [article.link])

  const decodedTitle = decode(article.title)
  const decodedDescription = typeof article.description === 'string' ? decode(article.description) : ''

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "")
  }

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
      ref={cardRef}
    >
      <div className={styles.articleCard_container}>
        <div className={styles.articleCard_imageContainer}>
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={decodedTitle}
            fill
            className={styles.articleCard_image}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
        </div>
        <div className={styles.articleCard_content}>
          <div className={styles.articleCard_source}>{source}</div> {/* Display source as "Scoop" header */}
          <h3 className={styles.articleCard_title}>
            {decodedTitle}
          </h3>
          <p className={styles.articleCard_description}>
            {stripHtml(decodedDescription)}
          </p>
        </div>
      </div>
    </a>
  )
}

export default ArticleCard
