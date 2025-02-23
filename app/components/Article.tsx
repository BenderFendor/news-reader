import type { FC } from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { decode } from "html-entities"

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
  isGridView?: boolean
  isTikTokStyle?: boolean
}

async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
      
      // If rate limited, wait before retrying
      if (response.status === 500) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
        continue
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
  throw new Error('Max retries reached')
}

const Article: FC<ArticleProps> = ({ article, isGridView = false, isTikTokStyle = false }) => {
  const [fallbackImage, setFallbackImage] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg")

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
          const imgMatch = description.match(/<img[^>]+src="([^">]+)"/)
          if (imgMatch && imgMatch[1]) {
            return imgMatch[1]
          }
        } catch (e) {
          console.error('Error parsing description for images:', e)
        }
      }

      // If no image found in RSS, try fetching from article
      if (!fallbackImage) {
        try {
          const response = await fetchWithRetry(
            `/api/fetchArticleImage?url=${encodeURIComponent(article.link)}`
          )
          const data = await response.json()
          if (data.imageUrl) {
            setFallbackImage(data.imageUrl)
            return data.imageUrl
          }
        } catch (error) {
          console.error('Error fetching article image:', error)
        }
      }

      return "/placeholder.svg"
    } catch (error) {
      console.error('Error in getImageUrl:', error)
      return "/placeholder.svg"
    }
  }

  useEffect(() => {
    let mounted = true

    const fetchImage = async () => {
      const url = await getImageUrl()
      if (mounted) {
        setImageUrl(url)
      }
    }

    fetchImage()

    return () => {
      mounted = false
    }
  }, [article.link, fallbackImage])

  const decodedTitle = decode(article.title)
  const decodedDescription = typeof article.description === 'string' ? decode(article.description) : ''

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "")
  }

  if (isTikTokStyle) {
    return (
      <div className="relative w-full h-[90vh] max-w-lg mx-auto bg-white dark:bg-dark-card rounded-lg shadow-xl overflow-hidden mt-4">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={decodedTitle}
          fill
          className="object-cover z-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="space-y-4 mb-16">
            <h2 className="text-2xl font-bold text-white">{decodedTitle}</h2>
            <p className="text-sm text-gray-200 line-clamp-3">{stripHtml(decodedDescription)}</p>
            <div className="flex justify-between items-center text-xs text-gray-300">
              <span>{article.source}</span>
              <span>{new Date(article.pubDate).toLocaleDateString()}</span>
            </div>
          </div>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 left-6 right-6 text-center bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Read more
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden ${isGridView ? "h-64 w-64" : "h-full w-full max-w-2xl"}`}
    >
      <div className="relative h-32 w-full">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={decodedTitle}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg"
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2">{decodedTitle}</h3>
        </div>
      </div>
      <div className="p-2">
        <div
          className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: stripHtml(decodedDescription) || "No description available",
          }}
        />
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
          <span className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full">{article.category}</span>
        </div>
      </div>
      <div className="px-2 py-1 border-t border-gray-200 dark:border-gray-700">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
        >
          Read more
        </a>
      </div>
    </div>
  )
}

export default Article

