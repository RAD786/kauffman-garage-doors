import Link from 'next/link'
import Image from 'next/image'
import { business } from '@/data/business'
import { services } from '@/data/services'
import { citiesByPriority } from '@/data/cities'
import { footerLegal } from '@/data/nav'
import { CallButton } from './CallButton'
import { MailIcon, PinIcon, ClockIcon } from './icons'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 text-navy-200">
      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand + NAP block. This is the citation-consistent one -- it must
              match the Google Business Profile character for character.
              The logo's white outline carries it against the navy background. */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-mark.png"
                alt={`${business.name} logo`}
                width={640}
                height={362}
                sizes="120px"
                className="h-[3.8rem] w-auto"
              />
              <div>
                <p className="font-display text-xl font-extrabold tracking-tight text-white">
                  {business.name}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-red-400">
                  {business.legalName}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-300">
              A family owned garage door company working out of Gainesville since{' '}
              {business.foundedYear}. Repairs, new doors, openers and custom wood across North
              Georgia.
            </p>

            <address className="mt-6 space-y-3 text-sm not-italic">
              <CallButton location="footer" size="md" subLabel="Call — we answer our own phone" />

              {/* min-h-11 keeps this above the 24px minimum target size. */}
              <a
                href={`mailto:${business.email}`}
                className="-my-1 flex min-h-11 items-center gap-2.5 text-navy-200 hover:text-white"
              >
                <MailIcon className="h-4 w-4 shrink-0 text-brand-red-400" />
                {business.email}
              </a>

              <p className="flex items-start gap-2.5">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-400" />
                <span>
                  {business.address.city}, {business.address.state} {business.address.zip}
                  <br />
                  <span className="text-navy-300">Mobile service across North Georgia</span>
                </span>
              </p>

              <p className="flex items-start gap-2.5">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-400" />
                <span>
                  Mon&ndash;Fri 7:30am&ndash;5:00pm
                  <br />
                  Sat 8:00am&ndash;1:00pm &middot; Sun closed
                </span>
              </p>
            </address>
          </div>

          {/* Services -- full crawlable list, no JS required. */}
          <nav aria-labelledby="footer-services" className="lg:col-span-3">
            <h2
              id="footer-services"
              className="text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              Services
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-navy-300 hover:text-white hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Service areas -- internal linking to every city page. */}
          <nav aria-labelledby="footer-areas" className="lg:col-span-3">
            <h2
              id="footer-areas"
              className="text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              Service Areas
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3 lg:grid-cols-1">
              {citiesByPriority.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/service-areas/${c.slug}`}
                    className="text-navy-300 hover:text-white hover:underline"
                  >
                    {c.name}, GA
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-company" className="lg:col-span-2">
            <h2
              id="footer-company"
              className="text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              Company
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-navy-300 hover:text-white hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-navy-300 hover:text-white hover:underline">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/service-areas" className="text-navy-300 hover:text-white hover:underline">
                  All Service Areas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-navy-300 hover:text-white hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/contact#request"
                  className="text-navy-300 hover:text-white hover:underline"
                >
                  Request Service
                </Link>
              </li>
              {footerLegal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-navy-300 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          {/* legalName already ends in a period ("Inc."), so don't add another. */}
          <p>
            &copy; {year} {business.legalName.replace(/\.$/, '')}. All rights reserved.
          </p>
          <p>
            Serving {business.counties.slice(0, -1).join(', ')} and{' '}
            {business.counties.at(-1)} counties and the north Atlanta metro.
          </p>
        </div>
      </div>
    </footer>
  )
}
