import type { Metadata } from 'next'
import { business } from '@/data/business'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, type Crumb } from '@/lib/schema'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | Kauffman Garage Doors',
  description:
    'How Kauffman Garage Doors handles the information you send through this website. We use it to respond to your request and nothing else.',
  path: '/privacy',
})

const crumbs: Crumb[] = [
  { name: 'Home', path: '/' },
  { name: 'Privacy Policy', path: '/privacy' },
]

/**
 * TODO(client): have a lawyer read this before launch, and update it if you
 * ever add analytics, remarketing pixels, or call tracking.
 */
export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <div className="container-page py-4">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <article className="container-page max-w-3xl pb-16">
        <h1 className="text-4xl font-extrabold text-navy-900">Privacy Policy</h1>
        {/* TODO(client): bump this whenever the policy actually changes. It is a
            literal on purpose -- deriving it from the build date would claim a
            revision every deploy. */}
        <p className="mt-3 text-sm text-navy-500">Last updated: August 2026</p>

        <div className="prose-local mt-8">
          <p>
            {business.legalName} operates kauffmangarage.com. This page explains what we collect
            through the site and what we do with it. The short version: we use what you send us to
            respond to your request, and we do not sell it.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">What we collect</h2>
          <p>
            When you submit the service request form, we receive the information you type into it:
            your name, phone number, city or ZIP code, the service you need, how soon you need it,
            an optional email address, and any notes you add. We also record which page the form was
            submitted from.
          </p>
          <p>
            If you call or email us, we have whatever you tell us and whatever your phone or email
            provider passes along, such as your phone number.
          </p>
          <p>
            Our web host may keep standard server logs, which can include IP addresses, browser
            type and the pages requested. These are used for security and to keep the site running.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">What we use it for</h2>
          <p>
            Responding to your request, scheduling and performing the work, invoicing, and following
            up about that job. That is the whole list.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">What we do not do</h2>
          <p>
            We do not sell your information. We do not rent it, trade it, or hand it to lead
            brokers. We do not add you to a marketing list because you asked us to fix a spring.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">Who else sees it</h2>
          <p>
            Service providers that help us run the business see only what they need to. That means
            our web host, our email provider, and any scheduling or invoicing software we use. We
            may also disclose information if the law requires it.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">Cookies and tracking</h2>
          <p>
            This site does not set advertising or tracking cookies. If that changes — for example if
            we add analytics or call tracking later — this page will be updated to say so before it
            goes live.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">How long we keep it</h2>
          <p>
            We keep job records as long as we need them for business and tax purposes. If you ask us
            to delete your information and we are not required to keep it, we will.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">Your choices</h2>
          <p>
            You can ask us what we have about you, ask us to correct it, or ask us to delete it.
            Call {business.phone.display} or email{' '}
            <a href={`mailto:${business.email}`}>{business.email}</a>.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">Children</h2>
          <p>
            This site is meant for adults arranging home services. We do not knowingly collect
            information from children.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">Contact</h2>
          <p>
            {business.legalName}
            <br />
            {business.address.city}, {business.address.state} {business.address.zip}
            <br />
            <a href={business.phone.href}>{business.phone.display}</a>
            <br />
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </p>
        </div>
      </article>
    </>
  )
}
