'use server'

import { deliverLead, validateLead, type FormState } from '@/lib/leads'

/**
 * Server action behind the lead form. Using an action rather than a client-side
 * fetch means the form still submits with JavaScript disabled or still loading,
 * which matters on a phone with one bar in a driveway.
 *
 * Every return path carries an incremented `attempt` -- see the note on
 * FormState for why the form is keyed on it.
 */
export async function submitLead(prev: FormState, formData: FormData): Promise<FormState> {
  const attempt = prev.attempt + 1

  const raw: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') raw[key] = value
  }

  // Values to hand back on a rejected submit, minus the honeypot.
  const echo = () => Object.fromEntries(Object.entries(raw).filter(([k]) => k !== 'company'))

  // Honeypot: a hidden field no human ever fills in. Bots fill everything.
  // Respond with the success state so the bot does not learn it was caught.
  if (raw.company) {
    return {
      status: 'success',
      message: 'Thanks — your request came through.',
      errors: {},
      values: {},
      attempt,
    }
  }

  const { errors, lead } = validateLead(raw)

  if (!lead) {
    return {
      status: 'error',
      message: 'Please fix the highlighted fields and send it again.',
      errors,
      values: echo(),
      attempt,
    }
  }

  try {
    await deliverLead(lead)
  } catch (err) {
    console.error('[lead] Unexpected delivery failure:', err)
    return {
      status: 'error',
      message:
        'Something went wrong sending that. Please call us at (770) 554-9990 and we will take care of it.',
      errors: {},
      values: echo(),
      attempt,
    }
  }

  return {
    status: 'success',
    message: 'Thanks — we got it.',
    errors: {},
    values: {},
    attempt,
  }
}
