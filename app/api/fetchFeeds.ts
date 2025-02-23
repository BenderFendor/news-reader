import { NextResponse } from "next/server"
import Parser from "rss-parser"

const parser = new Parser()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const feedUrls = searchParams.get("feeds")?.split(",") || []

  try {
    const feedPromises = feedUrls.map(async (url) => {
      try {
        const feed = await parser.parseURL(url)
        return feed.items
      } catch (error) {
        console.error(`Error fetching feed ${url}:`, error)
        return []
      }
    })

    const feedResults = await Promise.all(feedPromises)
    const allItems = feedResults.flat()

    allItems.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime())

    return NextResponse.json(allItems)
  } catch (error) {
    console.error("Error fetching feeds:", error)
    return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 })
  }
}

