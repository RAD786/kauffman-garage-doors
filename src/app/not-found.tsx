import Link from 'next/link'
import { services } from '@/data/services'
import { citiesByPriority } from '@/data/cities'
import { CallButton } from '@/components/CallButton'

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="container-page py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-6xl font-extrabold text-navy-200">404</p>
        <h1 className="mt-4 text-3xl font-extrabold text-navy-900 sm:text-4xl">
          That page isn&rsquo;t here
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-navy-700">
          The link may be old or mistyped. If you were trying to reach us about a door, the fastest
          thing to do is call.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <CallButton location="404" size="lg" subLabel="Call now — we answer" />
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border-2 border-navy-200 px-6 py-4 font-bold text-navy-800 transition-colors hover:border-navy-300 hover:bg-navy-50"
          >
            Back to the homepage
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-navy-500">
          Or try one of these
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="rounded-full border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-800 transition-colors hover:border-brand-red-600 hover:text-brand-red-600"
            >
              {s.name}
            </Link>
          ))}
          {citiesByPriority.map((c) => (
            <Link
              key={c.slug}
              href={`/service-areas/${c.slug}`}
              className="rounded-full border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-800 transition-colors hover:border-brand-red-600 hover:text-brand-red-600"
            >
              {c.name}, GA
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
