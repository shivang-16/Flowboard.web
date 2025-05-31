import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query;
    console.log(url, "herei surl")
    try {
      const response = await fetch(url as string);
      const html = await response.text();
      
      // Modify headers to allow embedding
      const modifiedHtml = html
        .replace(/x-frame-options: .*/gi, '')
        .replace(/content-security-policy: .*frame-ancestors.*/gi, '');
  
      res.status(200).send(modifiedHtml);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load content' });
    }
  }

// Remove the Pages Router handler as it's not being used in App Router
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    // Use more browser-like headers to avoid being blocked
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': url,
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch content: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      );
    }
    
    const contentType = response.headers.get('content-type') || 'text/html';
    const html = await response.text();
    
    // More comprehensive HTML modifications to allow embedding
    let modifiedHtml = html
      // Remove X-Frame-Options meta tags
      .replace(/<meta[^>]*http-equiv=['"]X-Frame-Options['"][^>]*>/gi, '')
      // Remove Content-Security-Policy meta tags
      .replace(/<meta[^>]*http-equiv=['"]Content-Security-Policy['"][^>]*>/gi, '')
      // Fix relative URLs for resources
      .replace(/(href|src)="\/([^"]*)"/gi, (match, attr, path) => {
        // Don't modify absolute URLs
        if (path.startsWith('http')) return match;
        
        // Create absolute URLs for relative paths
        const baseUrl = new URL(url);
        return `${attr}="${baseUrl.origin}/${path}"`;
      });
    
    // Add base tag to help with relative URLs
    const baseUrl = new URL(url);
    modifiedHtml = modifiedHtml.replace(
      /<head>/i, 
      `<head><base href="${baseUrl.origin}/">`
    );
    
    // Create a new response with modified headers
    const newResponse = new NextResponse(modifiedHtml, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Add headers to allow embedding
        'Access-Control-Allow-Origin': '*',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'self' *",
        // Cache control
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
    
    return newResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 });
  }
}