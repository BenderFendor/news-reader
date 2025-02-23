import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser'

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_REQUESTS = 10 // 10 requests per minute
const REQUEST_DELAY = 1000 // 1 second delay between requests

// Simple in-memory cache
const imageCache = new Map<string, { url: string, timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Track total requests instead of per-domain
let requestCount = 0
let lastRequestTime = Date.now()

async function fetchWithRateLimit(url: string): Promise<Response> {
  const now = Date.now()

  // Reset counter if window has passed
  if (now - lastRequestTime > RATE_LIMIT_WINDOW) {
    requestCount = 0
    lastRequestTime = now
  }

  // Increment counter
  requestCount++

  if (requestCount > RATE_LIMIT_REQUESTS) {
    throw new Error('Rate limit exceeded')
  }

  // Add delay between requests
  await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY))

  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  })
}

async function extractImageUrl(html: string, url: string): Promise<string | null> {
  const root = parse(html)
  
  // Try different methods to find an image
  const possibleImages = [
    // Open Graph image
    root.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    // Twitter card image
    root.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
    // Article featured image
    root.querySelector('article img, .post-content img, .entry-content img')?.getAttribute('src'),
    // First content image
    root.querySelector('img[src*="/uploads/"], img[src*="/wp-content/"], img[src*="/images/"]')?.getAttribute('src'),
    // Any image with reasonable dimensions
    ...Array.from(root.querySelectorAll('img'))
      .filter(img => {
        const width = parseInt(img.getAttribute('width') || '0')
        const height = parseInt(img.getAttribute('height') || '0')
        return width > 200 && height > 200
      })
      .map(img => img.getAttribute('src'))
  ].filter(Boolean)

  // Convert relative URLs to absolute
  const firstValidImage = possibleImages.find(img => img && (img.startsWith('http') || img.startsWith('/')))
  if (!firstValidImage) return null

  return firstValidImage.startsWith('http') 
    ? firstValidImage 
    : new URL(firstValidImage, url).toString()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const articleUrl = searchParams.get('url')

  if (!articleUrl) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }

  try {
    // Check cache first
    const cached = imageCache.get(articleUrl)
    const now = Date.now()
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({ imageUrl: cached.url })
    }

    // Fetch and parse the article
    const response = await fetchWithRateLimit(articleUrl)
    const html = await response.text()
    const imageUrl = await extractImageUrl(html, articleUrl)

    if (imageUrl) {
      // Cache the result
      imageCache.set(articleUrl, { url: imageUrl, timestamp: now })
      return NextResponse.json({ imageUrl })
    }

    return NextResponse.json({ imageUrl: '/placeholder.svg' })

  } catch (error) {
    console.error('Error fetching article image:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
} 