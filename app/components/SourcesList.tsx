import type { FC } from "react"
import { X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"

interface SourcesListProps {
  feeds: { url: string; category: string }[]
  onClose: () => void
  onRemoveFeed: (url: string) => void
  errors?: { url: string; error: string }[]
  loading?: boolean
}

const SourcesList: FC<SourcesListProps> = ({ feeds, onClose, onRemoveFeed, errors = [], loading = false }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [])

  // Add keyboard support for closing
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    firstFocusable?.focus()

    return () => modal.removeEventListener('keydown', handleTab)
  }, [feeds]) // Re-run when feeds change as it affects the number of focusable elements

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm will-change-transform"
        style={{ 
          animation: 'fadeIn 150ms ease-out'
        }}
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[85vh] bg-white dark:bg-black text-card-foreground shadow-xl rounded-xl overflow-hidden z-50 will-change-transform hover:shadow-lg transition-all"
        style={{ 
          animation: 'modalIn 200ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sources-title"
      >
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalIn {
            from { 
              opacity: 0;
              transform: translate(-50%, -48%) scale(0.96);
            }
            to { 
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}</style>
        <div className="flex justify-between items-center p-6 bg-gray-100 dark:bg-black">
          <h2 id="sources-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Sources</h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close sources dialog"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-8rem)] overscroll-contain bg-white dark:bg-black">
          {feeds.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No sources added yet. Click "Add Feed" to get started.
            </div>
          ) : (
            <ul className="space-y-4">
              {feeds.map((feed, index) => {
                const error = errors.find(e => e.url === feed.url);
                return (
                  <li key={index} className="bg-gray-50 dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-800 transition-all hover:shadow-md hover:bg-gray-100 dark:hover:bg-zinc-800">
                    <div className="flex justify-between items-start gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate text-lg text-gray-800 dark:text-gray-200">{new URL(feed.url).hostname}</p>
                          {loading ? (
                            <Loader2 size={18} className="animate-spin text-gray-400 dark:text-gray-500 shrink-0" />
                          ) : error ? (
                            <AlertCircle size={18} className="text-red-500 shrink-0" />
                          ) : (
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{feed.category}</p>
                        {error && (
                          <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            {error.error}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveFeed(feed.url)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium shrink-0 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default SourcesList

