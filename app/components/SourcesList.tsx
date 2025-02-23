import type { FC } from "react"
import { X } from "lucide-react"

interface SourcesListProps {
  feeds: { url: string; category: string }[]
  onClose: () => void
  onRemoveFeed: (url: string) => void
}

const SourcesList: FC<SourcesListProps> = ({ feeds, onClose, onRemoveFeed }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-card text-card-foreground shadow-lg p-6 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-serif">Your Sources</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
      </div>
      <ul className="space-y-4">
        {feeds.map((feed, index) => (
          <li key={index} className="bg-background rounded-lg p-3 shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium truncate">{new URL(feed.url).hostname}</p>
                <p className="text-sm text-muted-foreground">{feed.category}</p>
              </div>
              <button
                onClick={() => onRemoveFeed(feed.url)}
                className="text-destructive hover:text-destructive/80 text-sm"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SourcesList

