"use client"

interface FeedCardProps {
  feed: {
    url: string
    category: string
  }
}

/**
 * FeedCard component that displays a single feed
 */
const FeedCard: React.FC<FeedCardProps> = ({ feed }) => {
  return (
    <div className="feed-card bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-md font-medium">{feed.url}</h3>
      <p className="text-sm text-muted-foreground mt-1">{feed.category}</p>
    </div>
  )
}

export default FeedCard
