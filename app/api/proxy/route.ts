import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const targetUrl = url.searchParams.get('url')

    if (!targetUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { 
        status: 400,
        headers: CORS_HEADERS
      })
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsReader/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        error: `Failed to fetch: ${response.statusText}`,
        status: response.status
      }, { 
        status: response.status,
        headers: CORS_HEADERS
      })
    }

    const contentType = response.headers.get('content-type')
    return new NextResponse(await response.text(), {
      headers: {
        'Content-Type': contentType || 'text/xml',
        ...CORS_HEADERS
      }
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to proxy request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: CORS_HEADERS
    })
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS })
}