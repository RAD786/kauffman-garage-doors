import type { SVGProps } from 'react'
import type { Service } from '@/data/services'

/**
 * Inline stroke icons. No icon library dependency -- these ship as part of the
 * HTML, so there is no extra request and nothing to render-block.
 */

type IconProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1l-2.22 2.3Z" />
    </svg>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6.5 9 6 9-6" />
    </Base>
  )
}

export function PinIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </Base>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </Base>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Base strokeWidth="2.5" {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Base>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3.1L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4.2M12 17h.01" />
    </Base>
  )
}

export function ChevronIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Base>
  )
}

export function ArrowIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5" />
    </Base>
  )
}

/* --- Service icons -------------------------------------------------------- */

const serviceIcons: Record<Service['icon'], (p: IconProps) => React.ReactElement> = {
  wrench: (p) => (
    <Base {...p}>
      <path d="M15.5 3.5a5.5 5.5 0 0 0-5 7.7L3.8 17.9a2 2 0 0 0 2.8 2.8l6.7-6.7a5.5 5.5 0 0 0 7-7.2l-3 3-2.8-.7-.7-2.8 3-3a5.6 5.6 0 0 0-1.3-.8Z" />
    </Base>
  ),
  door: (p) => (
    <Base {...p}>
      <path d="M2.5 8.5 12 3.5l9.5 5" />
      <rect x="4.5" y="8.5" width="15" height="12" rx="1" />
      <path d="M4.5 12.5h15M4.5 16.5h15" />
    </Base>
  ),
  opener: (p) => (
    <Base {...p}>
      <rect x="3" y="9" width="7" height="6" rx="1.2" />
      <path d="M10 12h11M17 9v6" />
      <path d="M6.5 9V5.5M4.5 5.5h4" />
    </Base>
  ),
  spring: (p) => (
    <Base {...p}>
      <path d="M4 5h16M4 19h16" />
      <path d="M6 8h12M6 11h12M6 14h12M6 16.5h12" />
    </Base>
  ),
  'new-door': (p) => (
    <Base {...p}>
      <rect x="3.5" y="5" width="12" height="15" rx="1" />
      <path d="M3.5 9.5h12M3.5 14h12" />
      <path d="M19 5v6M22 8h-6" />
    </Base>
  ),
  wood: (p) => (
    <Base {...p}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.2" />
      <path d="M9 4.5v15M15 4.5v15" />
      <path d="M3.5 9h17M3.5 15h17" />
    </Base>
  ),
  haul: (p) => (
    <Base {...p}>
      <path d="M2.5 7.5h11v8h-11z" />
      <path d="M13.5 10.5h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </Base>
  ),
  carport: (p) => (
    <Base {...p}>
      <path d="M2 10 12 4l10 6" />
      <path d="M4.5 10v10M19.5 10v10" />
      <path d="M8 20v-5.5h8V20" />
    </Base>
  ),
}

export function ServiceIcon({ name, ...props }: IconProps & { name: Service['icon'] }) {
  const Icon = serviceIcons[name] ?? serviceIcons.wrench
  return Icon(props)
}
