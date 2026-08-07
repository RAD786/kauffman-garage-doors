import { primaryServices, secondaryServices } from './services'
import { citiesByPriority } from './cities'

export type NavLink = {
  label: string
  href: string
  /** Populates the desktop dropdown / mobile accordion. */
  children?: { label: string; href: string; description?: string }[]
}

export const mainNav: NavLink[] = [
  {
    label: 'Services',
    href: '/services',
    children: [
      ...primaryServices.map((s) => ({
        label: s.name,
        href: `/services/${s.slug}`,
        description: s.summary,
      })),
      ...secondaryServices.map((s) => ({
        label: s.name,
        href: `/services/${s.slug}`,
        description: s.summary,
      })),
    ],
  },
  {
    label: 'Service Areas',
    href: '/service-areas',
    children: citiesByPriority.map((c) => ({
      label: `${c.name}, GA`,
      href: `/service-areas/${c.slug}`,
      description: c.county,
    })),
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const footerLegal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Accessibility', href: '/accessibility' },
]
