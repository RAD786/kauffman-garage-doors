import Link from 'next/link'
import type { Crumb } from '@/lib/schema'

/**
 * Visible breadcrumbs. Google wants the on-page trail to match the
 * BreadcrumbList schema, so both are built from the same `Crumb[]`.
 */
export function Breadcrumbs({ crumbs, tone = 'light' }: { crumbs: Crumb[]; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'

  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol
        className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-sm ${
          dark ? 'text-navy-300' : 'text-navy-500'
        }`}
      >
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {last ? (
                <span
                  aria-current="page"
                  className={`font-semibold ${dark ? 'text-white' : 'text-navy-800'}`}
                >
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.path}
                    className={`hover:underline ${dark ? 'hover:text-white' : 'hover:text-navy-800'}`}
                  >
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true" className="opacity-50">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
