import type { Metadata } from 'next'
import Link from 'next/link'

import { services, primaryServices, secondaryServices } from '@/data/services'
// `services` is still used by the CollectionPage schema below.
import { citiesByPriority } from '@/data/cities'
import { absoluteUrl } from '@/data/business'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, ORG_ID, type Crumb } from '@/lib/schema'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CallButton } from '@/components/CallButton'
import { JsonLd } from '@/components/JsonLd'
import { CtaBand, SectionHeading, ServiceCard } from '@/components/sections'
import { ArrowIcon } from '@/components/icons'

export const metadata: Metadata = buildMetadata({
  title: 'Garage Door Services | Gainesville & North Georgia',
  description:
    'Garage door repair, installation, openers, springs, custom wood doors, haul away and carport conversions across North Georgia. Call (770) 554-9990.',
  path: '/services',
})

const crumbs: Crumb[] = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
]

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Garage Door Services',
            url: absoluteUrl('/services'),
            // Tie the collection to the business entity rather than leaving it
            // floating, same as every other page's schema.
            provider: { '@id': ORG_ID },
            hasPart: services.map((s) => ({
              '@type': 'Service',
              name: s.name,
              url: absoluteUrl(`/services/${s.slug}`),
            })),
          },
        ]}
      />

      <div className="bg-navy-900">
        <div className="container-page pb-14 pt-4 lg:pb-16">
          <Breadcrumbs crumbs={crumbs} tone="dark" />
          <SectionHeading
            as="h1"
            eyebrow="Services"
            tone="dark"
            title="Everything we do to a garage door"
            intro="Repairs, replacements, openers and the odd jobs in between. If your problem is not obviously on this list, call and describe it — it is almost certainly something we handle."
          />
          <div className="mt-8">
            <CallButton location="services-index-hero" size="lg" subLabel="Call now — we answer" />
          </div>
        </div>
      </div>

      <section className="container-page py-14 lg:py-16">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-navy-500">
          Most of what we do
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {primaryServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <h2 className="mt-14 text-xs font-bold uppercase tracking-[0.16em] text-navy-500">
          Specialty and one-off work
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        {/* Hub-page guidance. Without this the page is a link list, which is
            thin for a URL we want ranking on "garage door services". */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
              Not sure which one you need?
            </h2>
            <div className="prose-local mt-5">
              <p>
                Most people calling us do not know whether they need a spring, a cable, an opener or
                a whole door — and that is fine. You do not have to diagnose it. Describe what the
                door is doing and we will work it out.
              </p>
              <p>
                As a rough guide: if you heard a bang and the door will not lift, that is almost
                always a{' '}
                <Link href="/services/garage-door-spring-replacement">spring</Link>. If the motor
                runs but nothing moves, or the door reverses at the floor, that is usually the{' '}
                <Link href="/services/garage-door-openers">opener</Link> or its safety sensors. If
                the door is crooked, grinding or hanging off one side, that is general{' '}
                <Link href="/services/garage-door-repair">repair</Link> territory — track, rollers
                or cables.
              </p>
              <p>
                Rust through the bottom section, cracked panels at the hinge lines, or sections that
                are no longer manufactured are the three things that push a job from repair to{' '}
                <Link href="/services/new-garage-doors">replacement</Link>. We will tell you which
                side of that line you are on, including when the answer is the cheaper one.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
              What every job includes
            </h2>
            <div className="prose-local mt-5">
              <p>
                Whatever the work is, the way we run it does not change. You get a price before
                anything starts, not a number that appears on the invoice afterward. The person who
                quotes the job is the person who does it.
              </p>
              <p>
                Any repair that changes how much the door weighs — new springs, a new section, a new
                door — ends with the spring tension re-set to the actual door weight and the opener
                force and travel limits re-adjusted to match. Skipping that is how a correct-looking
                repair quietly destroys an opener over the following year.
              </p>
              <p>
                We finish by cycling the door, testing the safety reverse and the photo eyes, and
                showing you what to keep an eye on. If we think something else is close to failing,
                you will hear about it — you are not obliged to do anything about it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* One link per city, not one per service-and-city. The old 8x10 matrix
          emitted 80 links to just 10 URLs -- Google counts the first anchor to
          a target and ignores the rest, so the other 70 were pure bloat and a
          pile of sub-24px tap targets. */}
      <section className="border-y border-navy-100 bg-navy-50">
        <div className="container-page py-14 lg:py-16">
          <SectionHeading
            eyebrow="By town"
            title="Where we do it"
            intro="Every service on this page is available across our whole service area — six counties plus the north Atlanta metro."
          />

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {citiesByPriority.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/service-areas/${city.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-brand-red-600 hover:text-brand-red-600"
                >
                  {city.name}, GA
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/service-areas"
              className="inline-flex min-h-11 items-center gap-1.5 font-bold text-navy-800 underline underline-offset-4 hover:text-brand-red-600"
            >
              Browse service areas
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand location="services-index-cta" />
    </>
  )
}
