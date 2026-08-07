import { business, absoluteUrl } from '@/data/business'
import { cities, counties, type City } from '@/data/cities'
import { services, type Service, type ServiceFaq } from '@/data/services'

/**
 * JSON-LD builders. Everything hangs off one stable LocalBusiness @id so Google
 * can connect the org across pages instead of seeing a new business on each URL.
 */

/**
 * The single stable identifier for the business entity. Every page's schema
 * references this so Google connects them as one organisation. Exported so
 * page-level JSON-LD never hardcodes the domain.
 */
export const ORG_ID = absoluteUrl('/#business')
const WEBSITE_ID = absoluteUrl('/#website')

type Json = Record<string, unknown>

/** Drops empty strings, empty arrays, null and undefined so the output stays clean. */
function compact<T extends Json>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === null || v === undefined || v === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    })
  ) as T
}

function postalAddress() {
  return compact({
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.zip,
    addressCountry: business.address.country,
  })
}

function openingHours() {
  return business.hours.map((h) =>
    compact({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })
  )
}

/**
 * The core entity. `HomeAndConstructionBusiness` is the closest schema.org
 * subtype of LocalBusiness for a garage door contractor.
 */
export function localBusinessSchema() {
  const sameAs = Object.values(business.social).filter(Boolean)

  return compact({
    '@context': 'https://schema.org',
    '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
    '@id': ORG_ID,
    name: business.name,
    legalName: business.legalName,
    description: `${business.name} is a family owned garage door company based in ${business.address.city}, ${business.address.state}, serving North Georgia since ${business.foundedYear}. Garage door repair, installation, openers and spring replacement.`,
    url: absoluteUrl('/'),
    telephone: business.phone.raw,
    email: business.email,
    foundingDate: String(business.foundedYear),
    // 512x512 opaque PNG (~86KB). Crawlers and social scrapers fetch this raw,
    // so it must not point at the 1.2MB source artwork.
    // TODO(client): once there are real job photos, point `image` at a photo of
    // actual work -- Google prefers a photo here, not a logo.
    image: absoluteUrl('/images/logo-schema.png'),
    logo: absoluteUrl('/images/logo-schema.png'),
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: [
      ...cities.map((c) => ({
        '@type': 'City',
        name: c.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: c.name,
          addressRegion: 'GA',
          addressCountry: 'US',
        },
      })),
      ...counties.map((name) => ({ '@type': 'AdministrativeArea', name })),
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
      geoRadius: String(business.geo.serviceRadiusMiles * 1609),
    },
    openingHoursSpecification: openingHours(),
    // No `priceRange`: we have no pricing data, and inventing "$$" is an
    // unsupported claim. No `aggregateRating` either -- there are no collected
    // reviews, and fabricating one is a manual-action risk.
    currenciesAccepted: 'USD',
    sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Garage Door Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          url: absoluteUrl(`/services/${s.slug}`),
        },
      })),
    },
  })
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: business.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  }
}

/** Service page entity, scoped to the whole service area. */
export function serviceSchema(service: Service) {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteUrl(`/services/${service.slug}#service`),
    name: service.name,
    description: service.metaDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    serviceType: service.name,
    category: 'Garage Door Services',
    provider: { '@id': ORG_ID },
    areaServed: cities.map((c) => ({
      '@type': 'City',
      name: c.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: c.name,
        addressRegion: 'GA',
        addressCountry: 'US',
      },
    })),
    // The scope bullets are deliberately NOT emitted as an OfferCatalog of
    // Services. "Bottom weather seal and side/top stop molding" is a task, not
    // a bookable service, and dressing a bullet list up as structured offers
    // reads as markup padding.
  })
}

/** City page entity -- the same business, scoped to one town. */
export function cityServiceSchema(city: City) {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteUrl(`/service-areas/${city.slug}#service`),
    name: `Garage Door Services in ${city.name}, GA`,
    description: city.metaDescription,
    url: absoluteUrl(`/service-areas/${city.slug}`),
    serviceType: 'Garage Door Repair, Installation and Openers',
    provider: { '@id': ORG_ID },
    areaServed: {
      '@type': 'City',
      name: city.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city.name,
        addressRegion: 'GA',
        addressCountry: 'US',
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Garage door services in ${city.name}`,
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: `${s.name} in ${city.name}, GA`,
          url: absoluteUrl(`/services/${s.slug}`),
        },
      })),
    },
  })
}

export function faqSchema(faqs: readonly ServiceFaq[], pagePath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': absoluteUrl(`${pagePath}#faq`),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': absoluteUrl('/contact#page'),
    url: absoluteUrl('/contact'),
    name: `Contact ${business.name}`,
    mainEntity: { '@id': ORG_ID },
  }
}
