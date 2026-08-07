'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { business } from '@/data/business'
import { mainNav } from '@/data/nav'
import { CallButton } from './CallButton'
import { ChevronIcon, ClockIcon, MailIcon, PhoneIcon } from './icons'

export function Header() {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const pathname = usePathname()

  // Close the mobile menu on navigation -- otherwise it stays open over the new page.
  useEffect(() => {
    setOpen(false)
    setOpenGroup(null)
  }, [pathname])

  // Lock body scroll behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    /*
     * Solid background, NOT backdrop-blur. `backdrop-filter` (like `filter` and
     * `transform`) makes an element the containing block for any
     * `position: fixed` descendant. With the blur on this element, the mobile
     * menu below resolved its `top-16 bottom-0` against the 64px header instead
     * of the viewport and collapsed to zero height -- it rendered, but was
     * invisible. Do not re-add backdrop-blur here unless the menu is moved out
     * of <header> first.
     */
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white">
      {/* Utility bar -- credibility line, hidden on small screens to save space. */}
      <div className="hidden bg-navy-900 text-navy-100 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p className="font-medium">
            Family owned since {business.foundedYear} &middot; Serving Atlanta and North Georgia
          </p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              Mon&ndash;Fri 7:30&ndash;5:00, Sat 8:00&ndash;1:00
            </span>
            {/* min-h-6 keeps this at the 24px WCAG 2.5.8 minimum inside the
                36px utility bar. */}
            <a
              href={`mailto:${business.email}`}
              className="inline-flex min-h-6 items-center gap-1.5 hover:text-white hover:underline"
            >
              <MailIcon className="h-3.5 w-3.5" />
              {business.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* Logo. Source artwork is RGBA with a genuinely transparent background,
            cropped to its art bounds by scripts/logo-build.ps1 -- no tile needed. */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 sm:gap-3"
          aria-label={`${business.name} — home`}
        >
          <Image
            src="/images/logo-mark.png"
            alt={`${business.name} logo`}
            width={640}
            height={362}
            priority
            sizes="(min-width: 1024px) 106px, 78px"
            className="h-11 w-auto lg:h-[3.6rem]"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-tight text-navy-900 sm:text-xl lg:text-2xl">
              Kauffman
            </span>
            <span className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-brand-red-600 sm:text-xs">
              Garage Doors
            </span>
          </span>
        </Link>

        {/* Desktop nav. Dropdowns open on hover and on keyboard focus. */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.95rem] font-semibold transition-colors ${
                    isActive(item.href)
                      ? 'text-brand-red-600'
                      : 'text-navy-800 hover:text-brand-red-600'
                  }`}
                >
                  {item.label}
                  <ChevronIcon className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 w-80 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="max-h-[70vh] overflow-y-auto rounded-xl border border-navy-100 bg-white p-2 shadow-lift">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2.5 hover:bg-navy-50"
                        >
                          <span className="block text-sm font-semibold text-navy-900">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="mt-0.5 block text-xs leading-snug text-navy-500">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-[0.95rem] font-semibold transition-colors ${
                  isActive(item.href)
                    ? 'text-brand-red-600'
                    : 'text-navy-800 hover:text-brand-red-600'
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Phone CTA in the header on every page at every breakpoint. Below
              sm there is no room for the number, so it collapses to an
              icon-only button that is still a full-size tap target. */}
          <div className="hidden sm:block">
            <CallButton location="header" size="md" subLabel="Call now" />
          </div>
          <a
            href={business.phone.href}
            data-cta="call"
            data-cta-location="header-compact"
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-red-600 text-white active:bg-brand-red-800 sm:hidden"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-navy-200 text-navy-800 lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-navy-100 bg-white lg:hidden"
        >
          <div className="container-page py-5">
            <CallButton location="mobile-menu" size="lg" fullWidth subLabel="Tap to call — we answer" />

            <nav aria-label="Mobile" className="mt-6">
              <ul className="divide-y divide-navy-100 border-y border-navy-100">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    {item.children ? (
                      <>
                        <div className="flex items-stretch">
                          <Link
                            href={item.href}
                            className="flex-1 py-4 text-lg font-bold text-navy-900"
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenGroup((g) => (g === item.label ? null : item.label))
                            }
                            aria-expanded={openGroup === item.label}
                            className="px-3 text-navy-600"
                          >
                            <span className="sr-only">
                              {openGroup === item.label ? 'Collapse' : 'Expand'} {item.label}
                            </span>
                            <ChevronIcon
                              className={`h-5 w-5 transition-transform ${openGroup === item.label ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </div>
                        {openGroup === item.label && (
                          <ul className="pb-3">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block rounded-lg px-3 py-2.5 text-[0.95rem] font-medium text-navy-700 hover:bg-navy-50"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link href={item.href} className="block py-4 text-lg font-bold text-navy-900">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 space-y-2 text-sm text-navy-700">
              <a
                href={`mailto:${business.email}`}
                className="inline-flex items-center gap-2 font-medium hover:text-brand-red-600"
              >
                <MailIcon className="h-4 w-4" />
                {business.email}
              </a>
              <p className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 shrink-0" />
                Mon&ndash;Fri 7:30am&ndash;5:00pm &middot; Sat 8:00am&ndash;1:00pm
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
