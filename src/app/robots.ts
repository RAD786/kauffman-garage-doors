import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/data/business'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nothing here is secret; these just keep junk out of the index.
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    // No `host` directive: Google ignores it, and Next emitted it with a
    // trailing slash, which is malformed even for the crawlers that read it.
  }
}
