import { business } from '@/data/business'
import { PhoneIcon } from './icons'

type Props = {
  /** Analytics label so you can tell which CTA on the page actually earns calls. */
  location: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'red' | 'white' | 'outline'
  className?: string
  /** Small line under the number, e.g. "Tap to call". */
  subLabel?: string
  fullWidth?: boolean
}

const sizes = {
  sm: 'px-4 py-2.5 text-sm gap-2',
  md: 'px-5 py-3 text-base gap-2.5',
  lg: 'px-7 py-4 text-lg sm:text-xl gap-3',
}

const variants = {
  red: 'bg-brand-red-600 text-white hover:bg-brand-red-700 active:bg-brand-red-800 shadow-card',
  white: 'bg-white text-navy-900 hover:bg-navy-50 active:bg-navy-100 shadow-card',
  outline: 'border-2 border-white/70 text-white hover:bg-white/10 active:bg-white/20',
}

/**
 * The primary conversion element on the entire site. Phone calls are goal #1,
 * so this is a real <a href="tel:"> -- crawlable, works with JS disabled, and
 * carries a data attribute for click tracking.
 */
export function CallButton({
  location,
  size = 'md',
  variant = 'red',
  className = '',
  subLabel,
  fullWidth = false,
}: Props) {
  return (
    <a
      href={business.phone.href}
      data-cta="call"
      data-cta-location={location}
      aria-label={`Call ${business.name} at ${business.phone.display}`}
      className={`inline-flex items-center justify-center rounded-lg font-bold tracking-tight transition-colors duration-150 ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <PhoneIcon className={size === 'lg' ? 'h-6 w-6 shrink-0' : 'h-5 w-5 shrink-0'} />
      <span className="flex flex-col items-start leading-tight">
        <span>{business.phone.display}</span>
        {subLabel && (
          <span className="text-[0.7em] font-medium opacity-85">{subLabel}</span>
        )}
      </span>
    </a>
  )
}
