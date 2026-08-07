import type { Metadata } from 'next'
import { business } from '@/data/business'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, type Crumb } from '@/lib/schema'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility | Kauffman Garage Doors',
  description:
    'How kauffmangarage.com is built for accessibility, and how to tell us if something on the site does not work for you.',
  path: '/accessibility',
})

const crumbs: Crumb[] = [
  { name: 'Home', path: '/' },
  { name: 'Accessibility', path: '/accessibility' },
]

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <div className="container-page py-4">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <article className="container-page max-w-3xl pb-16">
        <h1 className="text-4xl font-extrabold text-navy-900">Accessibility</h1>

        <div className="prose-local mt-8">
          <p>
            We want anyone to be able to use this site to reach us, whatever device or assistive
            technology they are on. Calling a garage door company should not require good eyesight
            or a mouse.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">What we have done</h2>
          <p>This site was built with the following in mind:</p>
          <ul className="mt-4 space-y-2 pl-5 text-navy-800 marker:text-brand-red-600">
            <li className="list-disc">Semantic HTML with proper heading structure on every page</li>
            <li className="list-disc">
              A skip-to-content link, and a keyboard-visible focus outline on every interactive
              element
            </li>
            <li className="list-disc">
              Form fields with real labels, error messages tied to their inputs, and errors
              announced to screen readers
            </li>
            <li className="list-disc">Text and interface colors chosen to meet contrast guidelines</li>
            <li className="list-disc">
              Touch targets sized for thumbs, not cursors, and a phone button reachable from any
              page
            </li>
            <li className="list-disc">
              Reduced-motion support for people who have that turned on at the system level
            </li>
            <li className="list-disc">
              Accordions built with native HTML, so the answers are present even without JavaScript
            </li>
          </ul>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">
            Specifics you may care about
          </h2>
          <p>
            Every page works without JavaScript. The service request form is a standard HTML form
            posting to the server, so it submits and validates even if scripts are blocked or still
            loading. The FAQ accordions are native <code>&lt;details&gt;</code> elements, so the
            answers are readable and searchable with scripts off.
          </p>
          <p>
            Nothing on the site depends on colour alone to carry meaning. Form errors are shown as
            text next to the field they belong to, tied to the input programmatically, and
            announced when they appear — not just as a red outline.
          </p>
          <p>
            The phone number is a real <code>tel:</code> link in the header, the footer, and a
            fixed bar at the bottom of every page on mobile, so reaching us never requires
            navigating the site. If you use voice control, the call buttons are labelled with the
            business name and number rather than just &ldquo;call&rdquo;.
          </p>
          <p>
            Text can be zoomed to 200% without content being cut off or overlapping, and the layout
            reflows down to a 320px-wide viewport without horizontal scrolling.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">Where we are</h2>
          <p>
            We aim to meet WCAG 2.1 Level AA. We are not claiming a formal certification — that
            would require a third-party audit we have not done. What we can say is that
            accessibility was designed in rather than bolted on, and that we will fix problems when
            we hear about them.
          </p>

          <h2 className="mt-10 text-2xl font-extrabold text-navy-900">
            If something does not work
          </h2>
          <p>
            Tell us and we will fix it. Call <a href={business.phone.href}>{business.phone.display}</a>{' '}
            or email <a href={`mailto:${business.email}`}>{business.email}</a> and describe what you
            ran into — which page, what you were trying to do, and what device or software you were
            using if you know.
          </p>
          <p>
            And if the website is in your way, the phone always works. We would rather take your
            call than have you fight with a form.
          </p>
        </div>
      </article>
    </>
  )
}
