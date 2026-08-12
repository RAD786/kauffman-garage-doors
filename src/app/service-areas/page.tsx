import type { Metadata } from 'next'
import Link from 'next/link'

import { cities, citiesByPriority } from '@/data/cities'
import { services } from '@/data/services'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, type Crumb } from '@/lib/schema'
import { absoluteUrl, business } from '@/data/business'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CallButton } from '@/components/CallButton'
import { JsonLd } from '@/components/JsonLd'
import { CityCard, CtaBand, SectionHeading } from '@/components/sections'
import { PinIcon } from '@/components/icons'

export const metadata: Metadata = buildMetadata({
  title: 'Service Areas | Garage Door Repair, North Georgia',
  description:
    `We serve Gainesville, Flowery Branch, Oakwood, Buford, Cumming, Hoschton, Jefferson, Dawsonville, Cleveland and north Atlanta. Call ${business.phone.display}.`,
  path: '/service-areas',
})

const crumbs: Crumb[] = [
  { name: 'Home', path: '/' },
  { name: 'Service Areas', path: '/service-areas' },
]

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Garage door service areas in North Georgia',
            itemListElement: citiesByPriority.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `${c.name}, GA`,
              url: absoluteUrl(`/service-areas/${c.slug}`),
            })),
          },
        ]}
      />

      <div className="bg-navy-900">
        <div className="container-page pb-14 pt-4 lg:pb-16">
          <Breadcrumbs crumbs={crumbs} tone="dark" />

          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Service areas"
                tone="dark"
                title="Where Kauffman works"
                intro="We are based in Gainesville and run north into the mountains, south into the Atlanta metro, and everywhere in between. Six counties and change."
              />
              {/* Uses the canonical six-county list, not the per-city county
                  strings -- those dedupe to seven chips including both "Hall
                  County" and "Gwinnett & Hall Counties", which contradicts the
                  "6 counties" figure in the panel alongside. */}
              <div className="mt-6 flex flex-wrap gap-2">
                {business.counties.map((county) => (
                  <span
                    key={county}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-semibold text-navy-100 ring-1 ring-navy-700"
                  >
                    <PinIcon className="h-3.5 w-3.5 text-brand-red-400" />
                    {county} County
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-semibold text-navy-100 ring-1 ring-navy-700">
                  <PinIcon className="h-3.5 w-3.5 text-brand-red-400" />
                  North Atlanta metro
                </span>
              </div>
              <div className="mt-8">
                <CallButton
                  location="areas-index-hero"
                  size="lg"
                  subLabel="Not sure if we reach you? Ask."
                />
              </div>
            </div>

            {/* A real coverage summary rather than a placeholder map graphic.
                Everything here is derived from the data files, so it cannot
                drift out of date when a town or county is added. */}
            <div className="rounded-2xl border border-navy-700 bg-navy-950/50 p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-red-400">
                Coverage at a glance
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy-300">
                    Based in
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-white">
                    {business.address.city}, {business.address.state}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy-300">
                    Towns covered
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-white">
                    {cities.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy-300">
                    Counties
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-white">
                    {business.counties.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-navy-300">
                    Serving since
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-white">
                    {business.foundedYear}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-navy-700 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-300">
                  Quickest response
                </p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-navy-100">
                  Gainesville, Oakwood and Flowery Branch — our home turf. Atlanta is the far edge
                  of the range and better suited to planned work than same-day calls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container-page py-14 lg:py-16">
        {/* Section heading added so the CityCard <h3>s do not jump straight
            from the page <h1>. */}
        <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">Towns we cover</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {citiesByPriority.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>

        {/* Regional context. A hub page that is only a list of links is thin;
            this is the content that makes it worth ranking. */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
              What North Georgia does to a garage door
            </h2>
            <div className="prose-local mt-5">
              <p>
                Working one region for forty years teaches you that geography shows up in the
                hardware. Around Lake Lanier — Gainesville, Flowery Branch, the eastern edge of
                Forsyth County — humidity gets into the bottom section of a steel door and rots it
                from the inside out, taking rollers, hinges and bottom brackets with it.
              </p>
              <p>
                Out in the subdivisions that filled in Hall, Forsyth, Gwinnett and Jackson counties
                from the mid-90s onward, the pattern is different: whole streets built the same year
                with the same builder-grade springs and openers, which then fail within a couple of
                years of each other. If your neighbours have all had somebody out lately, that is
                why.
              </p>
              <p>
                North of us — Dawsonville, Cleveland and up toward Helen — it turns into mountain
                work. Heavier wood and carriage-house doors on cabins and custom homes, often
                running on springs and openers sized for something lighter. Steeper lots that pitch
                water toward the slab and chew through bottom seal. Colder mornings that finish off
                a spring already at the end of its cycle life.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
              How our coverage actually works
            </h2>
            <div className="prose-local mt-5">
              <p>
                We run out of Gainesville, so Hall County and its immediate neighbours — Oakwood,
                Flowery Branch, Buford — are the areas we reach fastest. Forsyth, Jackson, Dawson
                and White counties are regular territory. Atlanta and the north metro are the far
                end of our range, which means we are a good fit there for planned work like a new
                or custom door, and a poor fit for a same-hour emergency.
              </p>
              <p>
                We would rather tell you that than take the job and disappoint you. When you call,
                say where you are and how urgent it is, and you will get a straight answer about
                what we can genuinely do and when.
              </p>
              <p>
                Do not see your town? We cover more ground than the {cities.length} areas listed
                here — these are just the ones we work in most. Call and ask rather than assuming,
                and we will give you a yes or a no instead of sending a truck two counties away and
                charging you for the drive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* One link per service, not one per city-and-service. The old grid
          emitted 80 links to 8 URLs, all as sub-24px tap targets. */}
      <section className="border-y border-navy-100 bg-navy-50">
        <div className="container-page py-14 lg:py-16">
          <SectionHeading
            eyebrow="Town by town"
            title="What we do in each area"
            intro="Same services everywhere we go. The housing stock is what changes — and that changes the work."
          />

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-brand-red-600 hover:text-brand-red-600"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand location="areas-index-cta" />
    </>
  )
}
