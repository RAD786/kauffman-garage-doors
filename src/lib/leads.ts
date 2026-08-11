import { business } from '@/data/business'
import { services } from '@/data/services'
import { cities } from '@/data/cities'

/** Shape of a validated lead, ready to deliver. */
export type Lead = {
  name: string
  phone: string
  email: string
  location: string
  service: string
  urgency: string
  notes: string
  /** Which page the form was submitted from -- tells you what content earns leads. */
  sourcePath: string
  submittedAt: string
}

export type FieldErrors = Partial<Record<keyof Lead, string>>

/**
 * Name of the hidden anti-bot field. Deliberately meaningless: anything
 * recognisable ("company", "website", "fax") gets filled by browser autofill
 * and password managers even when the input is off-screen with
 * autocomplete="off", which silently discards real leads.
 * Shared so the form and the action can never disagree about the name.
 */
export const HONEYPOT_FIELD = 'kgd_ref_2'

export type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  errors: FieldErrors
  /** Echoed back so a failed submit does not wipe what the user typed. */
  values: Record<string, string>
  /**
   * Increments on every server response. The form element is keyed on this so
   * it remounts after a rejected submit.
   *
   * Why: React 19 calls form.reset() once a server action resolves. A reset
   * restores each <select> to the option carrying the `selected` HTML
   * attribute -- and React sets the selected *property*, never the attribute.
   * So text inputs survive a reset (their `value` attribute holds the echoed
   * value) but dropdowns silently blank out. Remounting makes React re-apply
   * every defaultValue from scratch, which restores selects correctly too.
   */
  attempt: number
}

export const initialFormState: FormState = {
  status: 'idle',
  message: '',
  errors: {},
  values: {},
  attempt: 0,
}

export const urgencyOptions = [
  { value: 'emergency', label: 'Emergency — car stuck or door won’t close' },
  { value: 'today-tomorrow', label: 'Soon — today or tomorrow if possible' },
  { value: 'this-week', label: 'This week' },
  { value: 'flexible', label: 'No rush — whenever works' },
  { value: 'quote', label: 'Just getting a quote / planning ahead' },
] as const

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  { value: 'not-sure', label: 'Not sure — need someone to look at it' },
  { value: 'other', label: 'Something else' },
]

const urgencyValues = new Set<string>(urgencyOptions.map((o) => o.value))
const serviceValues = new Set<string>(serviceOptions.map((o) => o.value))

export function urgencyLabel(value: string): string {
  return urgencyOptions.find((o) => o.value === value)?.label ?? value
}

export function serviceLabel(value: string): string {
  return serviceOptions.find((o) => o.value === value)?.label ?? value
}

/** US phone: 10 digits, or 11 starting with 1. Strips formatting first. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

export function formatPhone(e164: string): string {
  const d = e164.replace(/\D/g, '').slice(-10)
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : e164
}

/**
 * Server-side validation. Client-side `required` attributes are a convenience;
 * this is the check that actually counts.
 */
export function validateLead(raw: Record<string, string>): {
  errors: FieldErrors
  lead: Lead | null
} {
  const errors: FieldErrors = {}

  const name = raw.name?.trim() ?? ''
  if (name.length < 2) errors.name = 'Please enter your name.'
  else if (name.length > 100) errors.name = 'That name is too long.'

  const phoneRaw = raw.phone?.trim() ?? ''
  const phone = normalizePhone(phoneRaw)
  if (!phoneRaw) errors.phone = 'We need a phone number to call you back.'
  else if (!phone) errors.phone = 'Please enter a 10-digit US phone number.'

  const email = raw.email?.trim() ?? ''
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'That email address does not look right.'
  }

  const location = raw.location?.trim() ?? ''
  if (location.length < 2) errors.location = 'Enter your city or ZIP code.'
  else if (location.length > 80) errors.location = 'Please shorten this.'

  const service = raw.service?.trim() ?? ''
  if (!service) errors.service = 'Pick the service you need.'
  else if (!serviceValues.has(service)) errors.service = 'Pick an option from the list.'

  const urgency = raw.urgency?.trim() ?? ''
  if (!urgency) errors.urgency = 'Let us know how soon you need this.'
  else if (!urgencyValues.has(urgency)) errors.urgency = 'Pick an option from the list.'

  const notes = raw.notes?.trim() ?? ''
  if (notes.length > 2000) errors.notes = 'Please keep this under 2000 characters.'

  if (Object.keys(errors).length > 0 || !phone) return { errors, lead: null }

  return {
    errors,
    lead: {
      name,
      phone,
      email,
      location,
      service,
      urgency,
      notes,
      sourcePath: (raw.sourcePath || '/').slice(0, 200),
      submittedAt: new Date().toISOString(),
    },
  }
}

function leadAsText(lead: Lead): string {
  const city = cities.find(
    (c) => c.name.toLowerCase() === lead.location.trim().toLowerCase()
  )
  return [
    `New service request from ${business.name} website`,
    '',
    `Name:      ${lead.name}`,
    `Phone:     ${formatPhone(lead.phone)}`,
    `Email:     ${lead.email || '(not provided)'}`,
    `City/ZIP:  ${lead.location}${city ? ` (${city.county})` : ''}`,
    `Service:   ${serviceLabel(lead.service)}`,
    `Urgency:   ${urgencyLabel(lead.urgency)}`,
    '',
    'Notes:',
    lead.notes || '(none)',
    '',
    '---',
    `Submitted: ${lead.submittedAt}`,
    `From page: ${lead.sourcePath}`,
  ].join('\n')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function leadAsHtml(lead: Lead): string {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#5c84b6;font-size:13px;white-space:nowrap">${k}</td><td style="padding:6px 0;color:#0b2545;font-size:15px;font-weight:600">${escapeHtml(v)}</td></tr>`

  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:560px">
  <h2 style="color:#0b2545;margin:0 0 4px">New service request</h2>
  <p style="color:#5c84b6;margin:0 0 18px;font-size:14px">Submitted from ${escapeHtml(lead.sourcePath)}</p>
  <table style="border-collapse:collapse">
    ${row('Name', lead.name)}
    ${row('Phone', formatPhone(lead.phone))}
    ${row('Email', lead.email || '(not provided)')}
    ${row('City / ZIP', lead.location)}
    ${row('Service', serviceLabel(lead.service))}
    ${row('Urgency', urgencyLabel(lead.urgency))}
  </table>
  <p style="color:#5c84b6;font-size:13px;margin:20px 0 4px">Notes</p>
  <p style="color:#0b2545;font-size:15px;white-space:pre-wrap;margin:0;padding:12px;background:#f2f6fb;border-radius:8px">${escapeHtml(lead.notes || '(none)')}</p>
  <p style="margin:22px 0 0">
    <a href="tel:${lead.phone}" style="background:#c8102e;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">Call ${escapeHtml(formatPhone(lead.phone))}</a>
  </p>
</div>`
}

/**
 * Delivers the lead everywhere that is configured. Each channel is independent
 * so one misconfigured integration cannot swallow a lead -- if any channel
 * succeeds we treat the submission as delivered, and if none are configured we
 * still return true and log, so the form never appears broken to a customer.
 */
export async function deliverLead(lead: Lead): Promise<{ delivered: boolean; channels: string[] }> {
  const channels: string[] = []
  const attempts: Promise<void>[] = []

  const resendKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_EMAIL_TO || business.email
  const from = process.env.LEAD_EMAIL_FROM

  if (resendKey && from) {
    attempts.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: lead.email || undefined,
          subject: `Service request — ${lead.name}, ${lead.location} (${serviceLabel(lead.service)})`,
          text: leadAsText(lead),
          html: leadAsHtml(lead),
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            channels.push('email')
            return
          }
          // Log the body, not just the status. Resend's failure reasons are all
          // in the body -- unverified domain, from-address not on that domain,
          // bad key -- and a bare "403" tells you none of them.
          const body = await res.text().catch(() => '(no body)')
          console.error(`[lead] Resend rejected the send: ${res.status} ${body}`)
        })
        .catch((err) => console.error('[lead] Resend request failed:', err))
    )
  }

  const webhook = process.env.LEAD_WEBHOOK_URL
  if (webhook) {
    attempts.push(
      fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })
        .then((res) => {
          if (res.ok) channels.push('webhook')
          else console.error('[lead] Webhook rejected the post:', res.status)
        })
        .catch((err) => console.error('[lead] Webhook request failed:', err))
    )
  }

  await Promise.all(attempts)

  // Always log. If nothing is configured yet, this is the only record there is.
  if (channels.length === 0) {
    console.warn(
      '[lead] No delivery channel configured or all failed. Lead follows:\n' + leadAsText(lead)
    )
  } else {
    console.info(`[lead] Delivered via ${channels.join(', ')} — ${lead.name}, ${lead.location}`)
  }

  return { delivered: true, channels }
}
