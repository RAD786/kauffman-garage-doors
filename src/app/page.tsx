import type { Metadata } from 'next'
import Link from 'next/link'

import { business } from '@/data/business'
import { primaryServices, secondaryServices } from '@/data/services'
import { citiesByPriority } from '@/data/cities'
import { generalFaqs } from '@/data/faqs'
import { buildMetadata } from '@/lib/seo'
import { faqSchema } from '@/lib/schema'

import { CallButton } from '@/components/CallButton'
import { JsonLd } from '@/components/JsonLd'
import { LeadForm } from '@/components/LeadForm'
import {
  CheckList,
  CityCard,
  CtaBand,
  FaqList,
  SectionHeading,
  ServiceCard,
  TrustBar,
} from '@/components/sections'
import { AlertIcon, ArrowIcon, PhoneIcon } from '@/components/icons'
import Image from "next/image";

// Brand-led so it does not compete with /service-areas/gainesville, which
// targets "garage door repair gainesville" directly.
export const metadata: Metadata = buildMetadata({
  title: `${business.name} | Repair & Install, Gainesville GA`,
  description:
    `Family owned garage door repair, installation and openers in Atlanta and North Georgia. In business since 1984. Call ${business.phone.display}.`,
  path: '/',
})

const urgentSymptoms = [
  'Loud bang from the garage and now the door won’t open',
  'Door is crooked, off track, or hanging on one side',
  'Car is shut inside and you need to get out',
  'Door won’t close and you can’t lock up the house',
]

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(generalFaqs, '/')} />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,82,153,0.55),transparent_60%)]"
        />

        <div className="container-page relative py-12 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-red-400 ring-1 ring-navy-700">
                Serving the Atlanta area · Since 1984
              </p>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                Garage door services
                <span className="block text-brand-red-500">done right the first time</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-200">
                A family shop that has been fixing and installing garage doors
                across the Atlanta area for over forty years. Broken springs, dead openers, doors off
                track, full replacements. Call us and you get a person who knows doors, not a
                script.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CallButton
                  location="hero"
                  size="lg"
                  subLabel="Call now — we answer our own phone"
                />
                <Link
                  href="#request"
                  data-cta="form"
                  data-cta-location="hero"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-navy-500 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-navy-800"
                >
                  Request service online
                  <ArrowIcon className="h-5 w-5" />
                </Link>
              </div>

              <ul className="mt-8 grid gap-x-6 gap-y-2 text-sm font-medium text-navy-200 sm:grid-cols-2">
                {business.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-red-500" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pl-4">
              {/* Files in /public are served from the site root, so the path
                  must NOT include "/public". width/height are the file's real
                  intrinsic pixels (1448x1086) -- that ratio is what reserves
                  the correct box and keeps CLS at zero. */}
              <Image
                src="/images/hero.png"
                alt="A Kauffman technician adjusting a brown carriage-style garage door, with the company truck parked in the driveway"
                width={1448}
                height={1086}
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="h-auto w-full rounded-2xl border border-navy-700 shadow-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Urgent strip */}
      <section className="border-b border-navy-100 bg-brand-red-600">
        <div className="container-page py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <AlertIcon className="mt-0.5 h-6 w-6 shrink-0 text-white" />
              <div>
                <h2 className="text-lg font-extrabold text-white">
                  Broken spring or a door that won’t move? Don’t run the opener.
                </h2>
                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/90">
                  The springs do the lifting, not the opener. Running it with a broken spring can
                  bend the top section, snap a cable, or pull the door off the track — turning a
                  spring job into a much bigger one. Leave it down and call us.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <CallButton location="urgent-strip" size="md" variant="white" />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Services */}
      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          eyebrow="What we do"
          title="Garage door services across North Georgia"
          intro="Three things make up most of our work. If you are not sure which one you need, call and describe what the door is doing — that is usually enough for us to tell you."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {primaryServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

        <h3 className="mt-14 text-xs font-bold uppercase tracking-[0.16em] text-navy-500">
          Also from us
        </h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {secondaryServices.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group rounded-xl border border-navy-100 bg-navy-50/60 px-5 py-4 transition-colors hover:border-navy-200 hover:bg-white hover:shadow-card"
            >
              <span className="block text-sm font-bold text-navy-900 group-hover:text-brand-red-600">
                {service.shortName}
              </span>
              <span className="mt-1 block text-xs leading-snug text-navy-600">
                {service.summary}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <TrustBar />
        </div>
      </section>

      {/* -------------------------------------------------------- Why / about */}
      <section className="bg-navy-50">
        <div className="container-page py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Image
                src="/images/home-body.png"
                alt="Kauffman garage doors truck in front of premium garage door."
              width={1000}
              height={800}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="h-auto w-full rounded-2xl shadow-card"
            />

            <div>
              <SectionHeading
                eyebrow="Why Kauffman"
                title="Forty years of the same phone number"
                intro="We started working on garage doors in Atlanta in 1984 and never left the area. We are not a franchise, not a private-equity roll-up, and not a call center routing your job to whoever answers."
              />

              <div className="prose-local mt-6">
                <p>
                  That matters more than it sounds. When you have been in one area for four decades,
                  you cannot afford a bad job — you will see that customer at the grocery store.
                  Nearly all of our work comes from people we have worked for before and people they
                  told.
                </p>
                <p>
                  It also means we know the housing stock. We know which subdivisions went up with
                  under-sized springs, which lake-adjacent doors rust from the bottom, and which
                  older neighborhoods have openings a stock door will not fit.
                </p>
              </div>

              <div className="mt-7">
                <CheckList
                  columns={1}
                  items={[
                    'You get a price before we start, not after',
                    'We will tell you when a repair beats a replacement',
                    'The person who quotes the job is the person who does it',
                    'We carry the common parts, so most repairs finish in one visit',
                  ]}
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CallButton location="why-section" size="md" />
                <Link
                  href="/about"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-navy-800 underline underline-offset-4 hover:text-brand-red-600"
                >
                  More about the shop
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Call us when */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Call right away if"
              title="Some of these should not wait"
              intro="A garage door is the heaviest moving thing in most houses. A few symptoms mean stop using it now."
            />
            <ul className="mt-7 space-y-3">
              {urgentSymptoms.map((symptom) => (
                <li
                  key={symptom}
                  className="flex items-start gap-3 rounded-lg border border-brand-red-600/20 bg-brand-red-600/5 px-4 py-3"
                >
                  <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-600" />
                  <span className="text-[0.95rem] font-medium text-navy-900">{symptom}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <CallButton location="urgent-list" size="lg" subLabel="Tell us what it is doing" />
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="How it goes"
              title="What happens when you call"
              intro="No mystery pricing and no upsell script. Here is the whole process."
            />
            <ol className="mt-7 space-y-5">
              {[
                {
                  n: '1',
                  t: 'You describe the symptom',
                  d: 'Noise, position, whether it moves at all. Nine times out of ten we can narrow it down on the phone and load the right parts.',
                },
                {
                  n: '2',
                  t: 'We give you a real schedule',
                  d: 'A time we can actually hit. We are a small crew, so we would rather say tomorrow morning than promise an hour we will miss.',
                },
                {
                  n: '3',
                  t: 'Diagnosis and a price',
                  d: 'We test the door under power and by hand, find what failed, and give you the number before any work starts.',
                },
                {
                  n: '4',
                  t: 'Fix it and re-balance',
                  d: 'Parts replaced, spring tension set to the actual door weight, opener limits and safety reverse re-checked before we leave.',
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-navy-900">{step.t}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-navy-700">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Service area */}
      <section className="border-y border-navy-100 bg-navy-50">
        <div className="container-page py-16 lg:py-20">
          <SectionHeading
            eyebrow="Where we work"
            title="Serving Atlanta-metro, Gainesville and North Georgia"
            intro="Based in Gainesville, covering Hall, Forsyth, Jackson, Gwinnett, Dawson and White counties, plus the north Atlanta metro. If you are near the edge of that, call and ask — we will give you a straight answer."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {citiesByPriority.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/service-areas"
              className="inline-flex items-center gap-1.5 font-bold text-navy-800 underline underline-offset-4 hover:text-brand-red-600"
            >
              See all service areas
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Lead form */}
      <section id="request" className="scroll-mt-24 bg-navy-900">
        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Get on the schedule"
                title="Tell us what is going on"
                tone="dark"
                intro="Fill this out and we will call you back. If it is urgent, call us instead — the phone is always faster than the form."
              />

              <div className="mt-8 rounded-xl border border-navy-700 bg-navy-950/50 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-red-400">
                  Fastest way to reach us
                </p>
                <a
                  href={business.phone.href}
                  data-cta="call"
                  data-cta-location="form-section"
                  className="mt-3 inline-flex items-center gap-3 text-3xl font-extrabold text-white hover:text-brand-red-400 sm:text-4xl"
                >
                  <PhoneIcon className="h-7 w-7 shrink-0 text-brand-red-500" />
                  {business.phone.display}
                </a>
                <p className="mt-4 text-sm leading-relaxed text-navy-300">
                  Mon–Fri 7:30am–5:00pm · Sat 8:00am–1:00pm
                  <br />
                  {business.hoursNote}
                </p>
              </div>

              <div className="mt-8">
                <TrustBar tone="dark" />
              </div>
            </div>

            <div className="rounded-2xl border border-navy-700 bg-navy-800/50 p-6 sm:p-8">
              <LeadForm tone="dark" heading="Request service" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- FAQ */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Questions" title="Straight answers" />
            <p className="mt-4 leading-relaxed text-navy-700">
              If yours is not here, call and ask. We would rather talk it through than have you
              guess.
            </p>
            <div className="mt-6">
              <CallButton location="faq" size="md" />
            </div>
          </div>

          <FaqList faqs={generalFaqs} />
        </div>
      </section>

      {/* The "every service, every town" pill block that used to sit here was an
          exact duplicate of the footer, which appears on this page anyway. It
          added 18 redundant links and ~46% 6-gram overlap with /services. */}

      <CtaBand location="home-footer-cta" />
    </>
  )
}
