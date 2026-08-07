import type { Metadata } from 'next'
import { business, absoluteUrl, siteUrl } from '@/data/business'

type BuildMetadataArgs = {
  /**
   * The COMPLETE <title>, brand included. Emitted as `title.absolute` so the
   * root layout's `title.template` cannot append the brand a second time --
   * that bug produced "… | Kauffman Garage Doors | Kauffman Garage Doors"
   * on every page except the homepage. Keep these at or under ~62 characters
   * or Google truncates them in the SERP.
   */
  title: string
  /** Keep between roughly 70 and 158 characters. */
  description: string
  /** Site-relative path, e.g. `/services/garage-door-repair`. */
  path: string
  /** Set true on thin/duplicate utility pages. */
  noindex?: boolean
}

/**
 * Every page builds its metadata through here so canonicals, OG and Twitter
 * tags can never drift apart. `metadataBase` is set once in the root layout.
 */
export function buildMetadata({ title, description, path, noindex }: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(path)

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
    openGraph: {
      type: 'website',
      url,
      siteName: business.name,
      title,
      description,
      locale: 'en_US',
      // Set explicitly: declaring an `openGraph` object without `images`
      // suppresses the file-convention opengraph-image on child routes, which
      // left every page except the homepage with no share image.
      images: [
        {
          url: absoluteUrl('/opengraph-image'),
          width: 1200,
          height: 630,
          alt: `${business.name} — garage door repair and installation in Gainesville, GA`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/opengraph-image')],
    },
  }
}

export const defaultMetadataBase = new URL(siteUrl)
