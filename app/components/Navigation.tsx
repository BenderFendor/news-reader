import type { FC } from "react"
import { Sun, Moon, Grid, List, PlusCircle, BookOpen } from "lucide-react"

interface NavigationProps {
  viewMode: "grid" | "tiktok"
  setViewMode: (mode: "grid" | "tiktok") => void
  openAddFeedModal: () => void
  toggleSourcesList: () => void
}

const Navigation: FC<NavigationProps> = ({
  viewMode,
  setViewMode,
  openAddFeedModal,
  toggleSourcesList,
}) => {
  return (
    <nav className="bg-white dark:bg-amoled shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Scoop</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("tiktok")}
              className={`p-2 rounded-full transition-colors ${
                viewMode === "tiktok"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={openAddFeedModal}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              <PlusCircle size={20} />
              <span className="hidden md:inline">Add Feed</span>
            </button>
            <button
              onClick={toggleSourcesList}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <BookOpen size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

