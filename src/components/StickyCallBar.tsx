import Link from 'next/link'
import { business } from '@/data/business'
import { PhoneIcon, ArrowIcon } from './icons'

/**
 * Mobile-only sticky bar. Phone call is the primary goal so it gets the red
 * button and roughly two-thirds of the width; the form is the secondary path.
 *
 * Deliberately a server component with no JS: it must be there the instant the
 * page paints, not after hydration.
 */
export function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-800 bg-navy-900/98 backdrop-blur lg:hidden print:hidden">
      <div className="flex items-stretch gap-2 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5">
        <a
          href={business.phone.href}
          data-cta="call"
          data-cta-location="sticky-mobile-bar"
          aria-label={`Call ${business.name} at ${business.phone.display}`}
          className="flex flex-[2] items-center justify-center gap-2.5 rounded-lg bg-brand-red-600 px-3 py-3 font-bold text-white active:bg-brand-red-800"
        >
          <PhoneIcon className="h-5 w-5 shrink-0" />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[0.95rem]">{business.phone.display}</span>
            <span className="text-[0.65rem] font-medium opacity-85">Call now</span>
          </span>
        </a>

        <Link
          href="/contact#request"
          data-cta="form"
          data-cta-location="sticky-mobile-bar"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-navy-600 bg-navy-800 px-3 py-3 text-sm font-bold text-white active:bg-navy-700"
        >
          Request
          <ArrowIcon className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  )
}

/**
 * Spacer that reserves the sticky bar's height at the bottom of every page so
 * the bar never covers the footer. Height matches the bar above.
 */
export function StickyCallBarSpacer() {
  return <div aria-hidden="true" className="h-[4.6rem] lg:hidden print:hidden" />
}
