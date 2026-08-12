/**
 * Single source of truth for NAP (name / address / phone) and everything else
 * that has to stay identical across the site, the schema markup, and the
 * Google Business Profile. Change it here, it changes everywhere.
 */

export const business = {
  name: 'Kauffman Garage Doors',
  /** Used in schema.org `legalName` -- matches the logo and any paperwork. */
  legalName: 'Kauffman Door Inc.',
  shortName: 'Kauffman',
  tagline: 'Garage door repair and installation across North Georgia',
  foundedYear: 1984,
  /** Kept as a rounded, defensible statement. Update if the client prefers exact. */
  yearsInBusiness: '40+',

  phone: {
    /** Human-readable. Used in every visible label. */
    display: '770-555-0000',
    /** E.164. Used in tel: links and schema. */
    href: 'tel:+17705550000',
    raw: '+17705550000',
  },

  email: 'rdkkauffman@gmail.com',

  address: {
    /**
     * TODO(client): add the street address before launch if the shop takes
     * walk-ins. If it is a home-based / service-area business, leave
     * `street` empty -- the schema helpers below will omit it, and you should
     * also hide the address on the Google Business Profile.
     */
    street: '',
    city: 'Gainesville',
    state: 'GA',
    stateName: 'Georgia',
    zip: '30501',
    country: 'US',
  },

  /** Approximate center of the service area (Gainesville, GA) for geo schema. */
  geo: {
    latitude: 34.2979,
    longitude: -83.8241,
    /** Miles. Roughly covers Gainesville down through the north Atlanta metro. */
    serviceRadiusMiles: 80,
  },

  /**
   * Named counties covered. Single source of truth for both the "counties
   * covered" number in the trust bar and the county list in the footer, so the
   * two can never disagree.
   */
  counties: ['Hall', 'Forsyth', 'Jackson', 'Gwinnett', 'Dawson', 'White', 'Fulton', 'Gwinnett'],

  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:30', closes: '17:00' },
    { days: ['Saturday'], opens: '08:00', closes: '13:00' },
  ],
  // Deliberately not a callback-time guarantee -- the shop can't staff one.
  hoursNote: 'Closed Sundays. Leave a message any time and we will get back to you.',

  /**
   * TODO(client): fill these in with the real profile URLs once they exist, then
   * they will be emitted as schema.org `sameAs`. Empty strings are filtered out.
   */
  social: {
    google: '',
    facebook: '',
  },

  /**
   * Payment / service facts that are safe to state. Keep this list honest --
   * everything here shows up on the site as a promise.
   */
  facts: [
    'Family owned and operated',
    'Servicing Atlanta 40+ years',
    'We answer our own phone',
    'Straight answers on repair vs. replace',
  ],
} as const

/**
 * Canonical origin. MUST match the primary domain configured in Vercel --
 * Vercel serves www as primary and 308-redirects the apex to it, so the
 * fallback is www. A canonical pointing at a URL that redirects is a
 * self-contradicting signal on every page, so if the primary domain ever
 * changes, change this (and NEXT_PUBLIC_SITE_URL in Vercel) with it.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kauffmangarage.com'
).replace(/\/$/, '')

/** Absolute URL builder -- required for canonicals, OG tags and JSON-LD @id values. */
export function absoluteUrl(path = '/'): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
