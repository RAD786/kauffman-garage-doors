import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { business } from '@/data/business'
import { services, getService, getServices } from '@/data/services'
import { citiesByPriority } from '@/data/cities'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, faqSchema, serviceSchema, type Crumb } from '@/lib/schema'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CallButton } from '@/components/CallButton'
import { JsonLd } from '@/components/JsonLd'
import { LeadForm } from '@/components/LeadForm'
import { PlaceholderImage } from '@/components/PlaceholderImage'
import {
  CheckList,
  CtaBand,
  FaqList,
  ProcessSteps,
  SectionHeading,
  ServiceCard,
} from '@/components/sections'
import { AlertIcon, PhoneIcon, ServiceIcon } from '@/components/icons'

type Params = { slug: string }

/** Fully static -- every service page is prerendered at build time. */
export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  })
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const path = `/services/${service.slug}`
  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.shortName, path },
  ]
  const related = getServices(service.related)

  return (
    <>
      <JsonLd
        data={[serviceSchema(service), faqSchema(service.faqs, path), breadcrumbSchema(crumbs)]}
      />

      {/* --------------------------------------------------------------- Hero */}
      <div className="bg-navy-900">
        <div className="container-page pb-14 pt-4 lg:pb-16">
          <Breadcrumbs crumbs={crumbs} tone="dark" />

          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-800 text-brand-red-400 ring-1 ring-navy-700">
                <ServiceIcon name={service.icon} className="h-6 w-6" />
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                {service.name}
              </h1>
              <p className="mt-2 text-lg font-semibold text-brand-red-400">
                Gainesville &amp; North Georgia
              </p>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-200">
                {service.intro[0]}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CallButton
                  location={`service-hero-${service.slug}`}
                  size="lg"
                  subLabel="Call now — fastest way"
                />
                <Link
                  href="#request"
                  data-cta="form"
                  data-cta-location={`service-hero-${service.slug}`}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-navy-500 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-navy-800"
                >
                  Request a quote
                </Link>
              </div>
            </div>

            {/* Falls back to the placeholder until heroImage is set in services.ts. */}
            <PlaceholderImage
              src={service.heroImage?.src}
              width={service.heroImage?.width ?? 900}
              height={service.heroImage?.height ?? 700}
              alt={service.heroImage?.alt ?? `${service.name} in progress`}
              note="Job photo — real work, not stock"
              tone="dark"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-auto w-full rounded-2xl border border-navy-700 shadow-lift"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ Content */}
      <section className="container-page py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <div className="prose-local max-w-2xl">
              {service.intro.slice(1).map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            {/* Symptom list -- this is the section that catches problem searches. */}
            <div className="mt-12">
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                {service.signsHeading}
              </h2>
              <ul className="mt-6 space-y-2.5">
                {service.signs.map((sign) => (
                  <li
                    key={sign}
                    className="flex items-start gap-3 rounded-lg border border-navy-100 bg-navy-50/60 px-4 py-3"
                  >
                    <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-600" />
                    <span className="text-[0.95rem] font-medium text-navy-900">{sign}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-navy-700">
                Recognize any of these? Call{' '}
                <a
                  href={business.phone.href}
                  data-cta="call"
                  data-cta-location={`service-signs-${service.slug}`}
                  className="font-bold text-brand-red-600 underline underline-offset-2"
                >
                  {business.phone.display}
                </a>{' '}
                and describe it. We can usually narrow it down before we leave the shop.
              </p>
            </div>

            {/* Scope */}
            <div className="mt-14">
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                What&rsquo;s included
              </h2>
              <div className="mt-6">
                <CheckList items={service.includes} />
              </div>
            </div>

            {/* Process */}
            <div className="mt-14">
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                How the job runs
              </h2>
              <div className="mt-7">
                <ProcessSteps steps={service.process} />
              </div>
            </div>

            {/* Photo break */}
            <div className="mt-14">
              <PlaceholderImage
                src={service.bodyImage?.src}
                width={service.bodyImage?.width ?? 1100}
                height={service.bodyImage?.height ?? 620}
                alt={
                  service.bodyImage?.alt ??
                  `Before and after — ${service.shortName.toLowerCase()}`
                }
                note="Before / after pair works well here"
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="h-auto w-full rounded-2xl shadow-card"
              />
            </div>

            {/* FAQ */}
            <div className="mt-14">
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                {service.shortName} questions
              </h2>
              <div className="mt-4">
                <FaqList faqs={service.faqs} />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-navy-200 bg-navy-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-red-600">
                Fastest way to reach us
              </p>
              <a
                href={business.phone.href}
                data-cta="call"
                data-cta-location={`service-sidebar-${service.slug}`}
                className="mt-3 flex items-center gap-3 text-3xl font-extrabold text-navy-900 hover:text-brand-red-600"
              >
                <PhoneIcon className="h-6 w-6 shrink-0 text-brand-red-600" />
                {business.phone.display}
              </a>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">
                Mon&ndash;Fri 7:30am&ndash;5:00pm · Sat 8:00am&ndash;1:00pm
              </p>
              <div className="mt-5 border-t border-navy-200 pt-5">
                <p className="text-sm font-semibold text-navy-900">Family owned since 1984</p>
                <p className="mt-1 text-sm leading-relaxed text-navy-600">
                  {service.summary}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-navy-500">
                Where we do this
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {citiesByPriority.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/service-areas/${city.slug}`}
                      className="inline-flex min-h-11 items-center text-navy-700 underline decoration-navy-200 underline-offset-2 hover:text-brand-red-600"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ------------------------------------------------------------- Form */}
      <section id="request" className="scroll-mt-24 bg-navy-900">
        <div className="container-page py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Get on the schedule"
                tone="dark"
                title={`Need ${service.name.toLowerCase()}?`}
                intro="Send this over and we will call you back. If it is urgent, call us — the phone always beats the form."
              />
              <div className="mt-8">
                <CallButton
                  location={`service-form-${service.slug}`}
                  size="lg"
                  subLabel="Call now"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-navy-700 bg-navy-800/50 p-6 sm:p-8">
              <LeadForm
                tone="dark"
                defaultService={service.slug}
                heading={null}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Related */}
      {related.length > 0 && (
        <section className="container-page py-14 lg:py-16">
          <SectionHeading eyebrow="Related" title="Other things we handle" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </section>
      )}

      <CtaBand location={`service-footer-${service.slug}`} />
    </>
  )
}
