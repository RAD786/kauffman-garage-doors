import Image from 'next/image'

type Props = {
  /**
   * Drop a real photo at /public/images/<name> and pass it here -- the
   * placeholder disappears and next/image takes over. Until then, leave it off.
   */
  src?: string
  /** Describes the photo that belongs here. Doubles as the alt text. */
  alt: string
  width: number
  height: number
  className?: string
  /** Set on the LCP image only (the homepage hero). */
  priority?: boolean
  sizes?: string
  /** Extra guidance rendered under the dimensions, e.g. "wide shot, daylight". */
  note?: string
  /** Dark placeholder for use on navy sections. */
  tone?: 'light' | 'dark'
}

/**
 * Renders a real image when `src` is provided, and otherwise an inline SVG
 * placeholder stamped with its own pixel dimensions.
 *
 * Inline SVG rather than a placeholder service on purpose: zero network
 * requests, zero layout shift, and the reserved box is exactly the aspect
 * ratio the real photo needs to be -- so swapping in the photo later cannot
 * move the layout.
 */
export function PlaceholderImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  note,
  tone = 'light',
}: Props) {
  if (src) {
    /*
     * Forgive a missing leading slash. Files in /public are served from the
     * site root, so the path must start with "/". Without it next/image treats
     * the value as an external URL, calls new URL() on it, and dies with
     * "Failed to construct 'URL': Invalid URL" -- which says nothing about the
     * actual mistake. Normalise it and say so in dev instead.
     */
    let resolved = src
    if (!/^(\/|https?:\/\/|data:)/.test(src)) {
      resolved = `/${src.replace(/^\.?\//, '')}`
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[PlaceholderImage] src "${src}" is missing a leading slash. Using "${resolved}". ` +
            `Fix it in the data file -- paths are relative to /public, e.g. "/images/photo.png".`
        )
      }
    }

    return (
      <Image
        src={resolved}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={className}
      />
    )
  }

  // `dark` sits on navy sections, so it is lifted a step away from the section
  // background rather than matching it -- otherwise the box disappears.
  const dark = tone === 'dark'
  const bg = dark ? '#132f56' : '#e2eaf5'
  const grid = dark ? '#245089' : '#c4d4e9'
  const ink = dark ? '#a8c1de' : '#37619a'
  const inkStrong = dark ? '#ffffff' : '#0b2545'
  const gridId = `ph-grid-${width}x${height}-${tone}`

  // Type is sized against the viewBox, and these boxes render far smaller than
  // their intrinsic size -- so the ratios are deliberately large.
  const base = Math.min(width, height)
  const dimSize = Math.max(14, Math.min(74, Math.round(base * 0.105)))
  const labelSize = Math.max(10, Math.min(34, Math.round(base * 0.052)))
  const noteSize = Math.max(9, Math.min(26, Math.round(base * 0.04)))
  const showLabel = base >= 120
  const showNote = Boolean(note) && base >= 170

  const lines = showNote ? 3 : showLabel ? 2 : 1
  const lineGap = dimSize * 1.45
  const startY = height / 2 - ((lines - 1) * lineGap) / 2 + dimSize * 0.34

  return (
    <svg
      role="img"
      aria-label={`Image placeholder: ${alt}`}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={grid} strokeWidth="1" />
        </pattern>
      </defs>

      <rect width={width} height={height} fill={bg} />
      <rect width={width} height={height} fill={`url(#${gridId})`} />
      <rect
        x="1"
        y="1"
        width={width - 2}
        height={height - 2}
        fill="none"
        stroke={ink}
        strokeWidth="3"
        strokeDasharray="14 10"
        opacity="0.85"
      />

      <text
        x="50%"
        y={startY}
        textAnchor="middle"
        fill={inkStrong}
        fontSize={dimSize}
        fontWeight="700"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        {width} × {height}
      </text>

      {showLabel && (
        <text
          x="50%"
          y={startY + lineGap}
          textAnchor="middle"
          fill={ink}
          fontSize={labelSize}
          fontWeight="600"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {alt}
        </text>
      )}

      {showNote && (
        <text
          x="50%"
          y={startY + lineGap * 2}
          textAnchor="middle"
          fill={ink}
          fontSize={noteSize}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          opacity="0.9"
        >
          {note}
        </text>
      )}
    </svg>
  )
}
