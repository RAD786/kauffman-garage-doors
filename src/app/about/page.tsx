import type { Metadata } from 'next'
import Link from 'next/link'

import { business, absoluteUrl } from '@/data/business'
import { counties } from '@/data/cities'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, ORG_ID, type Crumb } from '@/lib/schema'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CallButton } from '@/components/CallButton'
import { JsonLd } from '@/components/JsonLd'
import { CheckList, CtaBand, SectionHeading, TrustBar } from '@/components/sections'
import { ArrowIcon } from '@/components/icons'
import Image from "next/image";

export const metadata: Metadata = buildMetadata({
  title: 'About Kauffman Garage Doors | Family Run Since 1984',
  description:
    'A small family run garage door company in Gainesville, GA. Over 40 years working on doors across North Georgia. Call (770) 554-9990.',
  path: '/about',
})

const crumbs: Crumb[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: `About ${business.name}`,
            url: absoluteUrl('/about'),
            mainEntity: { '@id': ORG_ID },
          },
        ]}
      />

      <div className="bg-navy-900">
        <div className="container-page pb-14 pt-4 lg:pb-16">
          <Breadcrumbs crumbs={crumbs} tone="dark" />

          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
            <div>
              <SectionHeading
                as="h1"
                eyebrow={`Family owned since ${business.foundedYear}`}
                tone="dark"
                title="A small shop that stayed small on purpose"
                intro="Kauffman has been working on garage doors out of Gainesville for over forty years. Same family, same town, same phone number."
              />
              <div className="mt-8">
                <CallButton location="about-hero" size="lg" subLabel="Call now — we answer" />
              </div>
            </div>

            <Image
              src="/images/about-hero.png"
              alt="A Kauffman garage doors company Sprinter van."
              width={1448}
              height={1086}
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="h-auto w-full rounded-2xl border border-navy-700 shadow-lift"
            />
          </div>
        </div>
      </div>

      <section className="container-page py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="prose-local max-w-2xl">
            <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
              Four decades in one place
            </h2>
            <p className="mt-4">
              We started working on garage doors in Hall County in {business.foundedYear} and never
              moved. In that time the area has changed enormously — subdivisions where there were
              pastures, a lake shoreline that filled in, and an Atlanta metro that keeps creeping
              north. The doors changed too. What has not changed is how we work.
            </p>
            <p>
              We are a family operation. That is not a marketing line, it is a description of the
              staffing. When you call, you get someone who works on doors. When we quote a job, the
              person quoting it is the person who will be doing it. There is no dispatcher, no
              scheduling department, and no script.
            </p>

            <h2 className="mt-12 text-2xl font-extrabold text-navy-900 sm:text-3xl">
              Why staying small matters
            </h2>
            <p className="mt-4">
              A lot of garage door companies in this market are not really local. They are national
              brands with a local number, or they are one of the roll-ups that has bought up
              regional shops and kept the old name on the truck. Those outfits work on volume, and
              volume means an incentive to sell you a new door when a spring would have done.
            </p>
            <p>
              We are the other thing. Nearly all of our work comes from people we have already
              worked for and people they sent. That only works if the last job was done right, so
              our incentive lines up with yours: fix the actual problem, charge what it costs, and
              be findable if something is not right.
            </p>
            <p>
              It also means we will occasionally tell you not to spend money. If your door has ten
              good years left and only needs a spring, we are going to tell you that.
            </p>

            <h2 className="mt-12 text-2xl font-extrabold text-navy-900 sm:text-3xl">
              What forty years of local work gets you
            </h2>
            <p className="mt-4">
              Experience in one area is worth more than experience in general. We know which
              subdivisions went up with under-sized springs, so we know why your eight-year-old door
              broke. We know that doors near Lake Lanier rust from the bottom section up, and what
              that means for whether a repair will hold. We know which older neighborhoods in
              Gainesville, Buford and intown Atlanta have openings a stock door will not fit.
            </p>
            <p>
              That knowledge is the difference between a truck showing up with the right part and a
              truck showing up twice.
            </p>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-navy-200 bg-navy-50 p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-navy-500">
                The short version
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-navy-900">Founded</dt>
                  <dd className="text-navy-600">{business.foundedYear}, Gainesville, Georgia</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-900">Ownership</dt>
                  <dd className="text-navy-600">Family owned and operated</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-900">Legal name</dt>
                  <dd className="text-navy-600">{business.legalName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-900">Coverage</dt>
                  <dd className="text-navy-600">{counties.join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-900">Hours</dt>
                  <dd className="text-navy-600">
                    Mon&ndash;Fri 7:30am&ndash;5:00pm
                    <br />
                    Sat 8:00am&ndash;1:00pm
                  </dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-navy-200 pt-5">
                <CallButton location="about-sidebar" size="md" fullWidth />
              </div>
            </div>

            <div className="mt-6">
            <Image
              src="/images/about-body.png"
              alt="A Kauffman garage doors white Dodge pick up truck."
              width={700}
              height={520}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="h-auto w-full rounded-2xl border border-navy-700 shadow-lift"
            />
            </div>
          </aside>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">How we work</h2>
          <div className="mt-6 max-w-4xl">
            <CheckList
              items={[
                'You get a price before the work starts, not on the invoice',
                'We tell you when a repair is the better spend than a replacement',
                'The person who quotes the job is the person who does it',
                'We carry the common parts, so most repairs finish in one visit',
                'Springs get sized to your actual door, not to whatever was on it before',
                'We reset opener force and limits after any repair that changes door weight',
                'If we are not the right company for the job, we will say so',
                'We answer our own phone',
              ]}
            />
          </div>
        </div>

        <div className="mt-14">
          <TrustBar />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 font-bold text-navy-800 underline underline-offset-4 hover:text-brand-red-600"
          >
            See what we do
            <ArrowIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/service-areas"
            className="inline-flex items-center gap-1.5 font-bold text-navy-800 underline underline-offset-4 hover:text-brand-red-600"
          >
            See where we work
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <CtaBand
        location="about-cta"
        title="Forty years in, still the same number."
        body="Call and tell us what the door is doing. We will give you a straight answer about what it needs and what it costs."
      />
    </>
  )
}
