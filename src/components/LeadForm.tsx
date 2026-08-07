'use client'

import { useActionState, useEffect, useId, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { usePathname } from 'next/navigation'
import { submitLead } from '@/app/actions'
import { initialFormState, serviceOptions, urgencyOptions } from '@/lib/leads'
import { business } from '@/data/business'
import { citiesByPriority } from '@/data/cities'
import { AlertIcon, CheckIcon, PhoneIcon } from './icons'

type Props = {
  /** Pre-selects the service dropdown when the form sits on a service page. */
  defaultService?: string
  /** Pre-fills city when the form sits on a city page. */
  defaultLocation?: string
  /** `dark` for use on a navy panel. */
  tone?: 'light' | 'dark'
  /** Heading rendered above the fields. Pass null to supply your own. */
  heading?: string | null
  subheading?: string
}

function SubmitButton({ tone }: { tone: 'light' | 'dark' }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      data-cta="form-submit"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-lg font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
        tone === 'dark'
          ? 'bg-brand-red-600 hover:bg-brand-red-500'
          : 'bg-brand-red-600 hover:bg-brand-red-700'
      }`}
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
          Sending…
        </>
      ) : (
        'Request Service'
      )}
    </button>
  )
}

export function LeadForm({
  defaultService,
  defaultLocation,
  tone = 'light',
  heading = 'Request service',
  subheading,
}: Props) {
  const [state, formAction] = useActionState(submitLead, initialFormState)
  const pathname = usePathname()
  const uid = useId()
  const statusRef = useRef<HTMLDivElement>(null)

  // Move focus to the result banner so screen reader users and keyboard users
  // are told what happened instead of being left at the bottom of the form.
  // Keyed on `attempt` too, so a second consecutive error still moves focus --
  // `status` alone stays 'error' between attempts and would not re-fire.
  useEffect(() => {
    if (state.status !== 'idle') statusRef.current?.focus()
  }, [state.status, state.attempt])

  const dark = tone === 'dark'
  const id = (n: string) => `${uid}-${n}`

  const labelBase = `block text-sm font-semibold ${dark ? 'text-navy-100' : 'text-navy-900'}`
  const hintBase = `mt-1 text-xs ${dark ? 'text-navy-300' : 'text-navy-500'}`
  // Placeholder text must clear 4.5:1 too -- it is real text, not decoration.
  const fieldBase = `mt-1.5 block w-full rounded-lg border px-3.5 py-3 text-base shadow-sm transition-colors ${
    dark ? 'placeholder:text-navy-300' : 'placeholder:text-navy-500'
  } ${
    dark
      ? 'border-navy-600 bg-navy-950/60 text-white focus:border-brand-red-400'
      : 'border-navy-200 bg-white text-navy-900 focus:border-brand-red-500'
  }`
  const errorRing = 'border-brand-red-600 ring-1 ring-brand-red-600'

  const v = (name: string, fallback = '') => state.values?.[name] ?? fallback
  const err = (name: keyof typeof state.errors) => state.errors?.[name]

  if (state.status === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        className={`rounded-2xl border p-8 text-center ${
          dark ? 'border-navy-600 bg-navy-950/60' : 'border-navy-200 bg-navy-50'
        }`}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-red-600 text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className={`mt-5 text-2xl font-extrabold ${dark ? 'text-white' : 'text-navy-900'}`}>
          Got it — thank you
        </h3>
        <p className={`mx-auto mt-3 max-w-md ${dark ? 'text-navy-200' : 'text-navy-700'}`}>
          Your request is in. We will call you back at the number you gave us. If you need it
          handled today, calling us directly is always the fastest way through.
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href={business.phone.href}
            data-cta="call"
            data-cta-location="form-success"
            className="inline-flex items-center gap-2.5 rounded-lg bg-brand-red-600 px-6 py-3.5 text-lg font-bold text-white hover:bg-brand-red-700"
          >
            <PhoneIcon className="h-5 w-5" />
            {business.phone.display}
          </a>
        </div>
      </div>
    )
  }

  return (
    // Keyed on `attempt` so a rejected submit remounts the fields and React
    // re-applies every defaultValue -- including the <select>s, which React 19's
    // post-action form.reset() would otherwise silently blank out.
    <form key={state.attempt} action={formAction} noValidate className="space-y-5">
      {heading && (
        <div>
          <h2 className={`text-2xl font-extrabold sm:text-3xl ${dark ? 'text-white' : 'text-navy-900'}`}>
            {heading}
          </h2>
          <p className={`mt-2 text-sm ${dark ? 'text-navy-200' : 'text-navy-600'}`}>
            {subheading ??
              'Tell us what is going on and we will call you back. Need it sorted today? Call us — that is always faster.'}
          </p>
        </div>
      )}

      {state.status === 'error' && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-brand-red-600 bg-brand-red-600/10 p-4"
        >
          <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-600" />
          <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-navy-900'}`}>
            {state.message}
          </p>
        </div>
      )}

      {/* Context for the notification email -- not user-editable. */}
      <input type="hidden" name="sourcePath" value={pathname} />

      {/* Honeypot. Hidden from humans and from assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id('company')}>Company (leave blank)</label>
        <input id={id('company')} type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className={labelBase}>
            Your name <span className="text-brand-red-600">*</span>
          </label>
          <input
            id={id('name')}
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={v('name')}
            aria-invalid={Boolean(err('name'))}
            aria-describedby={err('name') ? id('name-err') : undefined}
            className={`${fieldBase} ${err('name') ? errorRing : ''}`}
            placeholder="First and last"
          />
          {err('name') && (
            <p id={id('name-err')} className="mt-1.5 text-xs font-medium text-brand-red-600">
              {err('name')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id('phone')} className={labelBase}>
            Phone number <span className="text-brand-red-600">*</span>
          </label>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            defaultValue={v('phone')}
            aria-invalid={Boolean(err('phone'))}
            aria-describedby={err('phone') ? id('phone-err') : id('phone-hint')}
            className={`${fieldBase} ${err('phone') ? errorRing : ''}`}
            placeholder="(770) 555-0100"
          />
          {err('phone') ? (
            <p id={id('phone-err')} className="mt-1.5 text-xs font-medium text-brand-red-600">
              {err('phone')}
            </p>
          ) : (
            <p id={id('phone-hint')} className={hintBase}>
              This is how we reach you back.
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id('location')} className={labelBase}>
            City or ZIP code <span className="text-brand-red-600">*</span>
          </label>
          <input
            id={id('location')}
            name="location"
            type="text"
            required
            autoComplete="address-level2"
            list={id('city-list')}
            defaultValue={v('location', defaultLocation ?? '')}
            aria-invalid={Boolean(err('location'))}
            aria-describedby={err('location') ? id('location-err') : undefined}
            className={`${fieldBase} ${err('location') ? errorRing : ''}`}
            placeholder="Gainesville or 30501"
          />
          {/* Datalist, not a select -- we serve towns beyond the ten we list. */}
          <datalist id={id('city-list')}>
            {citiesByPriority.map((c) => (
              <option key={c.slug} value={c.name} />
            ))}
          </datalist>
          {err('location') && (
            <p id={id('location-err')} className="mt-1.5 text-xs font-medium text-brand-red-600">
              {err('location')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id('email')} className={labelBase}>
            Email <span className={dark ? 'text-navy-300' : 'text-navy-500'}>(optional)</span>
          </label>
          <input
            id={id('email')}
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={v('email')}
            aria-invalid={Boolean(err('email'))}
            aria-describedby={err('email') ? id('email-err') : undefined}
            className={`${fieldBase} ${err('email') ? errorRing : ''}`}
            placeholder="you@example.com"
          />
          {err('email') && (
            <p id={id('email-err')} className="mt-1.5 text-xs font-medium text-brand-red-600">
              {err('email')}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id('service')} className={labelBase}>
            What do you need? <span className="text-brand-red-600">*</span>
          </label>
          <select
            id={id('service')}
            name="service"
            required
            defaultValue={v('service', defaultService ?? '')}
            aria-invalid={Boolean(err('service'))}
            aria-describedby={err('service') ? id('service-err') : undefined}
            className={`${fieldBase} ${err('service') ? errorRing : ''}`}
          >
            <option value="">Choose a service…</option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err('service') && (
            <p id={id('service-err')} className="mt-1.5 text-xs font-medium text-brand-red-600">
              {err('service')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id('urgency')} className={labelBase}>
            How soon? <span className="text-brand-red-600">*</span>
          </label>
          <select
            id={id('urgency')}
            name="urgency"
            required
            defaultValue={v('urgency')}
            aria-invalid={Boolean(err('urgency'))}
            aria-describedby={err('urgency') ? id('urgency-err') : id('urgency-hint')}
            className={`${fieldBase} ${err('urgency') ? errorRing : ''}`}
          >
            <option value="">Choose a timeframe…</option>
            {urgencyOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err('urgency') ? (
            <p id={id('urgency-err')} className="mt-1.5 text-xs font-medium text-brand-red-600">
              {err('urgency')}
            </p>
          ) : (
            <p id={id('urgency-hint')} className={hintBase}>
              Emergency? Call us — the form is not monitored around the clock.
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={id('notes')} className={labelBase}>
          What is the door doing?{' '}
          <span className={dark ? 'text-navy-300' : 'text-navy-500'}>(optional)</span>
        </label>
        <textarea
          id={id('notes')}
          name="notes"
          rows={4}
          maxLength={2000}
          defaultValue={v('notes')}
          aria-invalid={Boolean(err('notes'))}
          aria-describedby={err('notes') ? id('notes-err') : id('notes-hint')}
          className={`${fieldBase} resize-y ${err('notes') ? errorRing : ''}`}
          placeholder="Noise, whether it moves at all, single or double door, whether a car is stuck inside — anything helps us bring the right parts."
        />
        {err('notes') ? (
          <p id={id('notes-err')} className="mt-1.5 text-xs font-medium text-brand-red-600">
            {err('notes')}
          </p>
        ) : (
          <p id={id('notes-hint')} className={hintBase}>
            The more detail, the better the chance we fix it in one trip.
          </p>
        )}
      </div>

      <SubmitButton tone={tone} />

      <p className={`text-center text-xs ${dark ? 'text-navy-300' : 'text-navy-500'}`}>
        We use your details to respond to this request and nothing else. We do not sell or share
        them.{' '}
        <a
          href={business.phone.href}
          data-cta="call"
          data-cta-location="form-footnote"
          className={`inline-flex min-h-11 items-center font-semibold underline underline-offset-2 ${dark ? 'text-white' : 'text-navy-800'}`}
        >
          Prefer to talk? Call {business.phone.display}
        </a>
      </p>
    </form>
  )
}
