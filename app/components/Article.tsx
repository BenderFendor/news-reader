import type { FC } from "react"
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

const Article: FC<ArticleProps> = ({ article, isGridView = false, isTikTokStyle = false }) => {
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

