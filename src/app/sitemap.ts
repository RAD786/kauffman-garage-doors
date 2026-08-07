import type { MetadataRoute } from 'next'
import { absoluteUrl, siteUrl } from '@/data/business'
import { services } from '@/data/services'
import { cities } from '@/data/cities'

/**
 * Generated from the same data files that generate the pages, so a new service
 * or city can never be left out of the sitemap.
 *
 * `lastModified` uses build time. Since the site is fully static, a rebuild is
 * exactly when content could have changed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    // Next normalises the homepage canonical to the origin with no trailing
    // slash, so the sitemap uses the same form. A sitemap URL that does not
    // match its page's canonical is a wasted crawl signal.
    { url: siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: absoluteUrl('/services'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    {
      url: absoluteUrl('/service-areas'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    { url: absoluteUrl('/contact'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/about'), lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: absoluteUrl('/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    {
      url: absoluteUrl('/accessibility'),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: s.tier === 'primary' ? 0.9 : 0.7,
  }))

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: absoluteUrl(`/service-areas/${c.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: c.priority,
  }))

  return [...staticPages, ...servicePages, ...cityPages]
}
