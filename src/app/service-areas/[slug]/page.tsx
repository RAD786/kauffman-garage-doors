import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { business } from '@/data/business'
import { cities, getCity, citiesByPriority } from '@/data/cities'
import { primaryServices, secondaryServices } from '@/data/services'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, cityServiceSchema, faqSchema, type Crumb } from '@/lib/schema'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CallButton } from '@/components/CallButton'
import { JsonLd } from '@/components/JsonLd'
import { LeadForm } from '@/components/LeadForm'
import { PlaceholderImage } from '@/components/PlaceholderImage'
import {
  CtaBand,
  FaqList,
  SectionHeading,
  ServiceCard,
  TrustBar,
} from '@/components/sections'
import { PhoneIcon, PinIcon } from '@/components/icons'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return cities.map((c) => ({ slug: c.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const city = getCity(slug)
  if (!city) return {}

  return buildMetadata({
    title: city.metaTitle,
    description: city.metaDescription,
    path: `/service-areas/${city.slug}`,
  })
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const city = getCity(slug)
  if (!city) notFound()

  const path = `/service-areas/${city.slug}`
  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Service Areas', path: '/service-areas' },
    { name: city.name, path },
  ]

  const nearby = citiesByPriority.filter((c) => c.slug !== city.slug).slice(0, 6)

  /**
   * Two auto-generated questions that genuinely differ per town (they name the
   * county and ZIPs), followed by this city's hand-written ones from the data
   * file. The three generic questions that used to live here -- cost, broken
   * spring, "do you install too" -- were byte-identical on all ten city pages
   * and were duplicated into ten FAQPage schema blocks. They already live on
   * the homepage and the relevant service pages, so they are linked, not
   * repeated.
   */
  const cityFaqs = [
    {
      question: `Do you serve all of ${city.name}?`,
      answer: `Yes — we cover ${city.name} and the surrounding ${city.county} area, including ${city.zips.join(', ')}. If you are just outside that, call and ask. We would rather tell you honestly than send a truck and charge you for the drive.`,
    },
    {
      question: `How soon can you get to ${city.name}?`,
      answer: city.isHomeBase
        ? `${city.name} is our home base, so it is typically the fastest area we cover. Call and we will tell you what we genuinely have available that day rather than guessing.`
        : `Call and we will give you a real time for ${city.name} rather than a window we cannot hit. We are a small family crew working out of Gainesville, so we schedule honestly instead of promising an hour and showing up at four.`,
    },
    ...city.faqs,
  ]

  return (
    <>
      <JsonLd
        data={[cityServiceSchema(city), faqSchema(cityFaqs, path), breadcrumbSchema(crumbs)]}
      />

      {/* --------------------------------------------------------------- Hero */}
      <div className="bg-navy-900">
        <div className="container-page pb-14 pt-4 lg:pb-16">
          <Breadcrumbs crumbs={crumbs} tone="dark" />

          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-red-400 ring-1 ring-navy-700">
                <PinIcon className="h-3.5 w-3.5" />
                {city.county}
              </p>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                Garage Door Repair in {city.name}, GA
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-200">
                {city.intro[0]}
              </p>

              <p className="mt-4 text-sm font-medium text-navy-300">
                Serving ZIP codes {city.zips.join(', ')}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CallButton
                  location={`city-hero-${city.slug}`}
                  size="lg"
                  subLabel="Call now — we answer"
                />
                <Link
                  href="#request"
                  data-cta="form"
                  data-cta-location={`city-hero-${city.slug}`}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-navy-500 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-navy-800"
                >
                  Request service
                </Link>
              </div>
            </div>

            {/* Falls back to the placeholder until heroImage is set in cities.ts. */}
            <PlaceholderImage
              src={city.heroImage?.src}
              width={city.heroImage?.width ?? 900}
              height={city.heroImage?.height ?? 700}
              alt={city.heroImage?.alt ?? `Garage door service in ${city.name}, GA`}
              note="Local job photo — recognizable street or house"
              tone="dark"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-auto w-full rounded-2xl border border-navy-700 shadow-lift"
            />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- Local intro + facts */}
      <section className="container-page py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <div className="prose-local max-w-2xl">
              {city.intro.slice(1).map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                {city.localHeading}
              </h2>
              <div className="prose-local mt-5 max-w-2xl">
                {city.local.map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </div>

            {/* Services in this city */}
            <div className="mt-14">
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                What we do in {city.name}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-navy-700">
                Same work everywhere we go. If you are not sure which of these you need, call and
                describe what the door is doing.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {primaryServices.map((service) => (
                  <ServiceCard key={service.slug} service={service} cityName={city.name} />
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {secondaryServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group rounded-lg border border-navy-100 bg-navy-50/60 px-4 py-3 transition-colors hover:border-navy-200 hover:bg-white"
                  >
                    <span className="block text-sm font-bold text-navy-900 group-hover:text-brand-red-600">
                      {service.name} in {city.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Photo break */}
            <div className="mt-14">
              <PlaceholderImage
                src={city.bodyImage?.src}
                width={city.bodyImage?.width ?? 1100}
                height={city.bodyImage?.height ?? 620}
                alt={city.bodyImage?.alt ?? `Completed garage door install in ${city.name}`}
                note="Finished door on a local home"
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="h-auto w-full rounded-2xl shadow-card"
              />
            </div>

            {/* FAQ */}
            <div className="mt-14">
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                {city.name} garage door questions
              </h2>
              <div className="mt-4">
                <FaqList faqs={cityFaqs} />
              </div>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-navy-700">
                Wondering about cost, or what to do the moment a spring lets go? Those are answered
                on our{' '}
                <Link
                  href="/services/garage-door-spring-replacement"
                  className="font-semibold text-navy-800 underline underline-offset-2 hover:text-brand-red-600"
                >
                  spring replacement
                </Link>{' '}
                and{' '}
                <Link
                  href="/services/garage-door-repair"
                  className="font-semibold text-navy-800 underline underline-offset-2 hover:text-brand-red-600"
                >
                  garage door repair
                </Link>{' '}
                pages — or just call and ask.
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------- Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-navy-200 bg-navy-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-red-600">
                Serving {city.name}
              </p>
              <a
                href={business.phone.href}
                data-cta="call"
                data-cta-location={`city-sidebar-${city.slug}`}
                className="mt-3 flex items-center gap-3 text-3xl font-extrabold text-navy-900 hover:text-brand-red-600"
              >
                <PhoneIcon className="h-6 w-6 shrink-0 text-brand-red-600" />
                {business.phone.display}
              </a>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">
                Mon&ndash;Fri 7:30am&ndash;5:00pm · Sat 8:00am&ndash;1:00pm
              </p>

              <dl className="mt-5 space-y-3 border-t border-navy-200 pt-5 text-sm">
                <div>
                  <dt className="font-semibold text-navy-900">County</dt>
                  <dd className="text-navy-600">{city.county}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-900">ZIP codes</dt>
                  <dd className="text-navy-600">{city.zips.join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-900">Based in</dt>
                  <dd className="text-navy-600">
                    Gainesville, GA — {business.yearsInBusiness} years
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-navy-500">
                Areas we cover near {city.name}
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {city.landmarks.map((landmark) => (
                  <li key={landmark} className="flex items-start gap-2 text-navy-700">
                    <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-600" />
                    {landmark}
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-navy-500">
                Neighborhoods
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">
                {city.neighborhoods.join(' · ')}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-navy-500">
                Nearby towns
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {nearby.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/service-areas/${c.slug}`}
                      className="inline-flex min-h-11 items-center text-navy-700 underline decoration-navy-200 underline-offset-2 hover:text-brand-red-600"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* --------------------------------------------------------------- Form */}
      <section id="request" className="scroll-mt-24 bg-navy-900">
        <div className="container-page py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow={`${city.name}, GA`}
                tone="dark"
                title="Get on the schedule"
                intro="Send us the details and we will call you back. Urgent? Call — the phone is always faster than the form."
              />
              <div className="mt-8">
                <CallButton location={`city-form-${city.slug}`} size="lg" subLabel="Call now" />
              </div>
              <div className="mt-8">
                <TrustBar tone="dark" />
              </div>
            </div>

            <div className="rounded-2xl border border-navy-700 bg-navy-800/50 p-6 sm:p-8">
              <LeadForm tone="dark" defaultLocation={city.name} heading={null} />
            </div>
          </div>
        </div>
      </section>

      {/* The "all services in <city>" pill block that used to sit here linked to
          the same 8 service pages as the grid above it. Removing it cut the
          per-city boilerplate that was driving ~48% 6-gram overlap between
          city pages. */}

      <CtaBand
        location={`city-footer-${city.slug}`}
        title={`Garage door trouble in ${city.name}?`}
      />
    </>
  )
}
