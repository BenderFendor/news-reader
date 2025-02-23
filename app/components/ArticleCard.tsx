import { type FC } from "react"
import { useEffect } from "react"
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
  source: string
}

const ArticleCard: FC<ArticleCardProps> = ({ article, source }) => {
  const imageUrl = (() => {
    if (article.enclosure?.url && article.enclosure.type?.startsWith("image/")) {
      return article.enclosure.url;
    } else if (article.enclosure?.["@_url"] && article.enclosure?.["@_type"]?.startsWith("image/")) {
      return article.enclosure["@_url"];
    } else if (article["media:content"]?.["@_url"] && article["media:content"]?.["@_type"]?.startsWith("image/")) {
      return article["media:content"]["@_url"];
    }
    return "/placeholder.svg";
  })();

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
    >
      <div className={styles.articleCard_container}>
        <div className={styles.articleCard_imageContainer}>
          <Image
            src={imageUrl}
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
          <div className={styles.articleCard_source}>{source}</div>
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
