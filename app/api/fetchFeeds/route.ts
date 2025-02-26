import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"
import { decode } from "html-entities"

// Configure route to work with Cloudflare Pages
export const dynamic = 'force-dynamic'
export const runtime = "edge"
export const preferredRegion = 'auto'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: true,
  trimValues: true,
})

/**
 * Retries a fetch operation with exponential backoff
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        next: { revalidate: 300 }, // Cache for 5 minutes
      })
      
      if (response.ok) return response
      
      // If response is not ok but it's the last retry, return it anyway
      if (i === retries - 1) return response
      
    } catch (error) {
      // On last retry, throw the error
      if (i === retries - 1) throw error
    }
    
    // Wait before retrying (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
  }
  
  throw new Error(`Failed to fetch after ${retries} retries`)
}

async function fetchWithProxy(url: string, options: RequestInit): Promise<Response> {
  // Try direct fetch first
  try {
    const response = await fetch(url, options)
    if (response.ok) return response
  } catch (error) {
    console.log(`Direct fetch failed for ${url}, trying proxy...`)
  }

  // If direct fetch fails, try proxy
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
  const response = await fetch(proxyUrl, options)
  if (!response.ok) {
    throw new Error(`Proxy fetch failed: ${response.statusText}`)
  }
  return response
}

/**
 * Fetches and parses an RSS feed with improved error handling
 */
async function fetchRSS(feed: { url: string; category: string }) {
  try {
    const response = await fetchWithProxy(feed.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsReader/1.0)",
        "Accept": "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for feed: ${feed.url}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('xml') && !contentType?.includes('text')) {
      throw new Error(`Invalid content type: ${contentType} for feed: ${feed.url}`)
    }

    const text = await response.text()
    if (!text.trim()) {
      throw new Error(`Empty response from feed: ${feed.url}`)
    }

    const result = parser.parse(text)
    
    // Handle different feed formats (RSS, Atom, etc.)
    const channel = result.rss?.channel || result.feed || {}
    const rawItems = channel.item || channel.entry || []
    const items = (Array.isArray(rawItems) ? rawItems : [rawItems]).map((item: any) => ({
      title: decode(item.title?.["#text"] || item.title || "No Title"),
      link: item.link?.["#text"] || item.link?.href || item.link || "#",
      description: decode(item.description || item.summary || item.content || ""),
      pubDate: item.pubDate || item.published || item.updated || new Date().toISOString(),
      enclosure: item.enclosure || item["media:content"] || null,
      source: decode(channel.title || feed.url),
      category: feed.category,
    }))

    return {
      url: feed.url,
      items,
      error: null,
    }
  } catch (error) {
    console.error(`Error fetching feed ${feed.url}:`, error)
    return {
      url: feed.url,
      items: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS })
}

/**
 * API route handler for fetching multiple RSS feeds
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const feedsParam = url.searchParams.get("feeds")

    if (!feedsParam) {
      return NextResponse.json(
        { error: "No feed URLs provided" }, 
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const feeds = JSON.parse(feedsParam)
    const feedResults = await Promise.all(feeds.map(fetchRSS))
    
    const allItems = feedResults.flatMap((result) => result.items)
    const errors = feedResults
      .filter((result) => result.error !== null)
      .map((result) => ({ url: result.url, error: result.error }))

    // Sort by publication date
    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    return NextResponse.json({
      items: allItems,
      errors,
      total: allItems.length,
    }, { 
      headers: CORS_HEADERS 
    })

  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : "Unknown error occurred",
    }, { 
      status: 500,
      headers: CORS_HEADERS
    })
  }
}

