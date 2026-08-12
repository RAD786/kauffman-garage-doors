import type { Metadata } from 'next'
import Link from 'next/link'

import { business } from '@/data/business'
import { citiesByPriority, counties } from '@/data/cities'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, contactPageSchema, type Crumb } from '@/lib/schema'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LeadForm } from '@/components/LeadForm'
import { SectionHeading, TrustBar } from '@/components/sections'
import { AlertIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/icons'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Kauffman Garage Doors | Gainesville, GA',
  description:
    `Call ${business.phone.display} or send a service request. Garage door repair, installation and openers across North Georgia. Family owned since 1984.`,
  path: '/contact',
})

const crumbs: Crumb[] = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[contactPageSchema(), breadcrumbSchema(crumbs)]} />

      <div className="bg-navy-900">
        <div className="container-page pb-12 pt-4 lg:pb-14">
          <Breadcrumbs crumbs={crumbs} tone="dark" />
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            tone="dark"
            title="Call us. It’s the fastest way."
            intro="We answer our own phone. Tell us what the door is doing and we can usually narrow it down before we get in the truck — which means the right parts show up on the first trip."
          />
        </div>
      </div>

      {/* Phone-first block, above the form on purpose. */}
      <section className="border-b border-navy-100 bg-white">
        <div className="container-page py-10">
          <div className="grid gap-5 md:grid-cols-3">
            <a
              href={business.phone.href}
              data-cta="call"
              data-cta-location="contact-primary"
              className="group flex flex-col justify-between rounded-2xl bg-brand-red-600 p-7 text-white transition-colors hover:bg-brand-red-700 md:col-span-2"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                  Call now
                </p>
                <p className="mt-3 flex items-center gap-3 font-display text-4xl font-extrabold sm:text-5xl">
                  <PhoneIcon className="h-8 w-8 shrink-0" />
                  {business.phone.display}
                </p>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/90">
                A real person, not a call center. If we are up a ladder, leave a message and we call
                back — we do not let messages sit.
              </p>
            </a>

            <div className="rounded-2xl border border-navy-200 bg-navy-50 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-500">
                Other ways
              </p>

              <a
                href={`mailto:${business.email}`}
                className="mt-3 flex min-h-11 items-center gap-3 text-sm font-semibold text-navy-900 hover:text-brand-red-600"
              >
                <MailIcon className="h-5 w-5 shrink-0 text-brand-red-600" />
                <span className="break-all">{business.email}</span>
              </a>

              <p className="mt-4 flex items-start gap-3 text-sm text-navy-700">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-600" />
                <span>
                  <strong className="block font-semibold text-navy-900">Hours</strong>
                  Mon&ndash;Fri 7:30am&ndash;5:00pm
                  <br />
                  Sat 8:00am&ndash;1:00pm
                  <br />
                  Sun closed
                </span>
              </p>

              <p className="mt-4 flex items-start gap-3 text-sm text-navy-700">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-600" />
                <span>
                  <strong className="block font-semibold text-navy-900">Based in</strong>
                  {business.address.city}, {business.address.state} {business.address.zip}
                  <br />
                  Mobile service across North Georgia
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-lg border border-brand-red-600/25 bg-brand-red-600/5 px-4 py-3.5">
            <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-600" />
            <p className="text-sm leading-relaxed text-navy-800">
              <strong className="font-bold">Broken spring or car stuck inside?</strong> Call rather
              than filling out the form. The form is not monitored around the clock and we would
              rather hear it from you directly.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- Form */}
      <section id="request" className="scroll-mt-24 bg-navy-50">
        <div className="container-page py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Service request"
                title="Or send us the details"
                intro="Tell us what is going on and where you are. We will call you back to confirm a time."
              />

              <div className="mt-8">
                <TrustBar />
              </div>

              <div className="mt-8 rounded-2xl border border-navy-200 bg-white p-6 shadow-card">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-navy-500">
                  Areas we cover
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-navy-700">
                  {counties.join(' · ')}
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                  {citiesByPriority.map((c) => (
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
                <p className="mt-4 text-xs leading-relaxed text-navy-500">
                  Outside these towns? Call and ask — we cover more ground than this list and will
                  tell you straight whether we can get to you.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-200 bg-white p-6 shadow-card sm:p-8">
              <LeadForm heading={null} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
