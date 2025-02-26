import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser'

/**
 * Configuration options for rate limiting and caching
 */
const CONFIG = {
  // Rate limiting settings
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute window
  RATE_LIMIT_REQUESTS: 15, // Requests per window
  REQUEST_DELAY: 300, // 300ms delay between requests
  
  // Cache settings
  CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days cache
  
  // Debug mode - set to false to reduce console output
  DEBUG: false,
  
  // Default placeholder image
  DEFAULT_IMAGE: '/placeholder.svg',
  
  // Minimum image dimensions to consider valid
  MIN_IMAGE_WIDTH: 200,
  MIN_IMAGE_HEIGHT: 150
}

// Configure route to work with Cloudflare Pages
// Force-dynamic ensures this route is not statically generated
export const dynamic = 'force-dynamic'
// Use edge runtime for better performance on Cloudflare
export const runtime = 'edge'
// This ensures the route is properly handled during static exports
export const preferredRegion = 'auto'

/**
 * In-memory cache for image URLs to avoid repeated fetches
 * Maps article URL to extracted image URL and timestamp
 */
const imageCache = new Map<string, { 
  url: string, 
  timestamp: number,
  status: 'success' | 'not-found' | 'error'
}>()

// Track request rate limiting
let requestCount = 0
let lastRequestTime = Date.now()

/**
 * Logs a message only when debug mode is enabled
 */
function debugLog(...args: any[]): void {
  if (CONFIG.DEBUG) {
    console.log('[fetchArticleImage]', ...args)
  }
}

/**
 * Fetch a URL with rate limiting to prevent abuse
 * @param url The URL to fetch
 * @returns Promise with the fetch response
 */
async function fetchWithRateLimit(url: string): Promise<Response> {
  const now = Date.now()

  // Reset counter if window has passed
  if (now - lastRequestTime > CONFIG.RATE_LIMIT_WINDOW) {
    requestCount = 0
    lastRequestTime = now
  }

  // Increment counter
  requestCount++

  // Check rate limit
  if (requestCount > CONFIG.RATE_LIMIT_REQUESTS) {
    const waitTime = CONFIG.RATE_LIMIT_WINDOW - (now - lastRequestTime)
    debugLog(`Rate limit reached, waiting ${waitTime}ms`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
    requestCount = 1
    lastRequestTime = Date.now()
  }

  // Add small delay between requests
  if (CONFIG.REQUEST_DELAY > 0) {
    await new Promise(resolve => setTimeout(resolve, CONFIG.REQUEST_DELAY))
  }

  // Perform the fetch with a user agent to prevent blocking
  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NewsReaderBot/1.0; +http://localhost)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  })
}

/**
 * Extract an image URL from HTML content
 * Uses multiple strategies to find a suitable image
 */
async function extractImageUrl(html: string, url: string): Promise<string | null> {
  try {
    const root = parse(html)
    const baseUrl = new URL(url).origin

    // Prioritized list of image sources to check
    const possibleSources = [
      // Open Graph/Facebook image (highest priority)
      root.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      root.querySelector('meta[property="og:image:secure_url"]')?.getAttribute('content'),
      
      // Twitter card image
      root.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
      root.querySelector('meta[name="twitter:image:src"]')?.getAttribute('content'),
      
      // Schema.org structured data
      root.querySelector('meta[itemprop="image"]')?.getAttribute('content'),
      
      // Apple touch icon or site icon
      root.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href'),
      root.querySelector('link[rel="icon"]')?.getAttribute('href'),
      
      // Article featured images
      ...Array.from(root.querySelectorAll('.featured-image img, .post-thumbnail img, .article-featured-image img'))
        .map(img => img.getAttribute('src')),
      
      // Common content areas
      ...Array.from(root.querySelectorAll('article img, .post-content img, .entry-content img, .content img'))
        .map(img => img.getAttribute('src')),
        
      // Any image with reasonable dimensions
      ...Array.from(root.querySelectorAll('img'))
        .filter(img => {
          const width = parseInt(img.getAttribute('width') || '0')
          const height = parseInt(img.getAttribute('height') || '0')
          return width >= CONFIG.MIN_IMAGE_WIDTH && height >= CONFIG.MIN_IMAGE_HEIGHT
        })
        .map(img => img.getAttribute('data-src') || img.getAttribute('src'))
    ].filter(Boolean)

    debugLog(`Found ${possibleSources.length} potential image sources`)

    // Convert relative URLs to absolute and select the first valid one
    for (const imgSrc of possibleSources) {
      if (!imgSrc) continue
      
      try {
        // If it's already an absolute URL
        if (imgSrc.startsWith('http')) {
          debugLog('Using absolute image URL:', imgSrc.substring(0, 50) + '...')
          return imgSrc
        }
        
        // Handle protocol-relative URLs //example.com/image.jpg
        if (imgSrc.startsWith('//')) {
          const absoluteUrl = `https:${imgSrc}`
          debugLog('Converted protocol-relative URL:', absoluteUrl.substring(0, 50) + '...')
          return absoluteUrl
        }
        
        // Handle relative URLs
        const absoluteUrl = new URL(imgSrc, url).toString()
        debugLog('Converted relative URL to absolute:', absoluteUrl.substring(0, 50) + '...')
        return absoluteUrl
      } catch (error) {
        debugLog('Error processing image URL:', imgSrc)
        continue
      }
    }

    debugLog('No suitable image found')
    return null
  } catch (error) {
    console.error('Error parsing HTML:', error)
    return null
  }
}

/**
 * API route handler for fetching article images
 * Modified to work with Cloudflare Pages static export
 */
export async function GET(request: Request) {
  try {
    // Use a try-catch to handle URL parsing errors
    const url = new URL(request.url)
    const articleUrl = url.searchParams.get('url')

    if (!articleUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    try {
      const now = Date.now()
      
      // Check cache first
      const cached = imageCache.get(articleUrl)
      
      // Use cached result if it exists and hasn't expired
      if (cached && (now - cached.timestamp) < CONFIG.CACHE_DURATION) {
        debugLog(`Cache hit for ${articleUrl} - status: ${cached.status}`)
        
        return NextResponse.json({ 
          imageUrl: cached.url,
          cached: true,
          status: cached.status
        })
      }

      debugLog(`Cache miss for ${articleUrl}, fetching...`)

      // Fetch and parse the article
      let imageUrl: string | null = null
      
      try {
        const response = await fetchWithRateLimit(articleUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const html = await response.text()
        imageUrl = await extractImageUrl(html, articleUrl)
      } catch (fetchError) {
        console.error('Error fetching article:', fetchError)
        
        // Cache the error to prevent repeated failing requests
        imageCache.set(articleUrl, {
          url: CONFIG.DEFAULT_IMAGE,
          timestamp: now,
          status: 'error'
        })
        
        return NextResponse.json({ 
          imageUrl: CONFIG.DEFAULT_IMAGE, 
          error: 'Failed to fetch article',
          status: 'error'
        })
      }

      // If we found an image
      if (imageUrl) {
        // Cache the successful result
        imageCache.set(articleUrl, {
          url: imageUrl,
          timestamp: now,
          status: 'success'
        })
        
        debugLog(`Found image for ${articleUrl}: ${imageUrl.substring(0, 50)}...`)
        return NextResponse.json({ imageUrl, status: 'success' })
      }
      
      // No image found, cache the negative result too
      imageCache.set(articleUrl, {
        url: CONFIG.DEFAULT_IMAGE,
        timestamp: now,
        status: 'not-found'
      })
      
      debugLog(`No image found for ${articleUrl}, using default`)
      return NextResponse.json({ imageUrl: CONFIG.DEFAULT_IMAGE, status: 'not-found' })

    } catch (error) {
      console.error('Critical error in fetchArticleImage:', error)
      return NextResponse.json({ 
        error: 'Internal server error', 
        imageUrl: CONFIG.DEFAULT_IMAGE 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Critical error in fetchArticleImage:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      imageUrl: CONFIG.DEFAULT_IMAGE 
    }, { status: 500 })
  }
}