import Link from 'next/link'
import type { Service } from '@/data/services'
import type { City } from '@/data/cities'
import { business } from '@/data/business'
import { CallButton } from './CallButton'
import { ArrowIcon, CheckIcon, ServiceIcon } from './icons'

/* --- Section heading ------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'light',
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: string
  intro?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  as?: 'h1' | 'h2' | 'h3'
}) {
  const dark = tone === 'dark'
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow && (
        <p
          className={`text-xs font-bold uppercase tracking-[0.16em] ${
            dark ? 'text-brand-red-400' : 'text-brand-red-600'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={`mt-2 text-3xl font-extrabold sm:text-4xl ${dark ? 'text-white' : 'text-navy-900'}`}
      >
        {title}
      </Tag>
      {intro && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-navy-200' : 'text-navy-700'}`}>
          {intro}
        </p>
      )}
    </div>
  )
}

/* --- Service card --------------------------------------------------------- */

export function ServiceCard({
  service,
  cityName,
}: {
  service: Service
  /** When set, the card links to the service but frames it for that town. */
  cityName?: string
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lift"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50 text-navy-700 transition-colors group-hover:bg-brand-red-600 group-hover:text-white">
        <ServiceIcon name={service.icon} className="h-6 w-6" />
      </span>

      <h3 className="mt-4 text-lg font-bold text-navy-900">
        {service.name}
        {cityName && <span className="block text-sm font-semibold text-navy-500">in {cityName}, GA</span>}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{service.summary}</p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-red-600">
        Learn more
        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/* --- City card ------------------------------------------------------------ */

export function CityCard({ city }: { city: City }) {
  return (
    <Link
      href={`/service-areas/${city.slug}`}
      className="group flex h-full flex-col rounded-xl border border-navy-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-lift"
    >
      <h3 className="text-base font-bold text-navy-900 group-hover:text-brand-red-600">
        {city.name}, GA
      </h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-navy-500">{city.county}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
        {city.zips.slice(0, 4).join(' · ')}
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-red-600">
        Garage door service
        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/* --- Checklist ------------------------------------------------------------ */

export function CheckList({
  items,
  columns = 2,
  tone = 'light',
}: {
  items: readonly string[]
  columns?: 1 | 2
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckIcon
            className={`mt-1 h-4 w-4 shrink-0 ${dark ? 'text-brand-red-400' : 'text-brand-red-600'}`}
          />
          <span className={`text-[0.95rem] leading-relaxed ${dark ? 'text-navy-200' : 'text-navy-800'}`}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}

/* --- Numbered process ----------------------------------------------------- */

export function ProcessSteps({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-navy-100 pl-8">
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
            {i + 1}
          </span>
          <h3 className="text-base font-bold text-navy-900">{step.title}</h3>
          <p className="mt-1.5 text-[0.95rem] leading-relaxed text-navy-700">{step.detail}</p>
        </li>
      ))}
    </ol>
  )
}

/* --- FAQ ------------------------------------------------------------------ */

/**
 * Uses native <details>, so answers are in the HTML for crawlers and the
 * accordion works with zero JavaScript.
 */
export function FaqList({
  faqs,
  tone = 'light',
}: {
  faqs: readonly { question: string; answer: string }[]
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <div className={`divide-y ${dark ? 'divide-navy-700' : 'divide-navy-100'}`}>
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-4">
          <summary
            className={`flex cursor-pointer list-none items-start justify-between gap-4 text-left text-[1.05rem] font-bold ${
              dark ? 'text-white' : 'text-navy-900'
            }`}
          >
            <span>{faq.question}</span>
            <span
              aria-hidden="true"
              className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lg font-bold leading-none transition-transform group-open:rotate-45 ${
                dark ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-700'
              }`}
            >
              +
            </span>
          </summary>
          <p className={`mt-3 pr-10 leading-relaxed ${dark ? 'text-navy-200' : 'text-navy-700'}`}>
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  )
}

/* --- CTA band ------------------------------------------------------------- */

export function CtaBand({
  title = 'Door giving you trouble? Let’s get it sorted.',
  body = 'Call and tell us what it is doing. Most of the time we can narrow it down on the phone and bring the right parts on the first trip.',
  location,
}: {
  title?: string
  body?: string
  /** Analytics label for the call button inside this band. */
  location: string
}) {
  return (
    <section className="bg-navy-900">
      <div className="container-page py-14 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-200">{body}</p>
            <p className="mt-4 text-sm font-semibold text-brand-red-400">
              Family owned since {business.foundedYear} · We answer our own phone
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <CallButton location={location} size="lg" fullWidth subLabel="Call now — fastest way" />
            <Link
              href="/contact#request"
              data-cta="form"
              data-cta-location={location}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-navy-500 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-navy-800"
            >
              Request service online
              <ArrowIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --- Trust bar ------------------------------------------------------------ */

export function TrustBar({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  const items = [
    { stat: business.yearsInBusiness, label: 'Years in business' },
    { stat: 'Family', label: 'Owned and operated' },
    // Derived, so it can't drift from the county list used in the footer.
    { stat: String(business.counties.length), label: 'Counties covered' },
    { stat: 'Local', label: 'Not a call center' },
  ]

  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-xl lg:grid-cols-4 ${
        dark ? 'bg-navy-700' : 'bg-navy-100'
      }`}
    >
      {items.map((item) => (
        <div key={item.label} className={`px-5 py-6 text-center ${dark ? 'bg-navy-900' : 'bg-white'}`}>
          <p
            className={`font-display text-3xl font-extrabold ${dark ? 'text-white' : 'text-navy-900'}`}
          >
            {item.stat}
          </p>
          <p className={`mt-1 text-xs font-semibold uppercase tracking-wide ${dark ? 'text-navy-300' : 'text-navy-500'}`}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}
