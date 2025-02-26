import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"
import { decode } from "html-entities"

// These exports ensure the route will be treated as dynamic and not statically generated
export const dynamic = 'force-dynamic'
export const runtime = "edge"

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
})

async function fetchRSS(feed: { url: string; category: string }) {
  try {
    const response = await fetch(feed.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsReader/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    const result = parser.parse(text)

    const channel = result.rss?.channel || result.feed || {}
    const items = (channel.item || channel.entry || []).map((item: any) => ({
      title: decode(item.title?.["#text"] || item.title || "No Title"),
      link: item.link?.["#text"] || item.link || "#",
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const feedsParam = searchParams.get("feeds")

  if (!feedsParam) {
    return NextResponse.json({ error: "No feed URLs provided" }, { status: 400 })
  }

  try {
    const feeds = JSON.parse(feedsParam)
    const feedResults = await Promise.all(feeds.map(fetchRSS))
    const allItems = feedResults.flatMap((result) => result.items)
    const errors = feedResults
      .filter((result) => result.error !== null)
      .map((result) => ({ url: result.url, error: result.error }))

    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    return NextResponse.json({
      items: allItems,
      errors,
      total: allItems.length,
    })
  } catch (error) {
    console.error("Error fetching feeds:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch feeds",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

