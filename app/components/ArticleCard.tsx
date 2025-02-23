import type { FC } from "react"
import Image from "next/image"
import { decode } from "html-entities"

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
}

const ArticleCard: FC<ArticleCardProps> = ({ article }) => {
  const getImageUrl = () => {
    if (article.enclosure?.url && article.enclosure.type?.startsWith("image/")) {
      return article.enclosure.url
    }
    if (article.enclosure?.["@_url"] && article.enclosure?.["@_type"]?.startsWith("image/")) {
      return article.enclosure["@_url"]
    }
    if (article["media:content"]?.["@_url"] && article["media:content"]?.["@_type"]?.startsWith("image/")) {
      return article["media:content"]["@_url"]
    }
    const imgMatch = article.description?.match(/<img[^>]+src="([^">]+)"/)?.[1]
    if (imgMatch) {
      return imgMatch
    }
    return "/placeholder.svg"
  }

  const imageUrl = getImageUrl()
  const decodedTitle = decode(article.title)
  const decodedDescription = decode(article.description)

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "")
  }

  return (
    <div className="bg-white dark:bg-amoled-card rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 hover:scale-105">
      <div className="relative h-40">
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
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
          {article.source}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold mb-2 line-clamp-2">{decodedTitle}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">{stripHtml(decodedDescription)}</p>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Read more
          </a>
        </div>
      </div>
    </div>
  )
}

export default ArticleCard

