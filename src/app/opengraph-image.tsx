import { ImageResponse } from 'next/og'
import { business } from '@/data/business'

export const alt = `${business.name} — Garage door repair and installation in Gainesville, GA`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Default social share card. Generated at build time so there is no static
 * asset to keep in sync with the phone number.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #061529 0%, #0b2545 55%, #16407a 100%)',
          padding: '68px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 14, height: 58, background: '#c8102e', borderRadius: 3 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#ffffff', letterSpacing: -1 }}>
              Kauffman Garage Doors
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#94b0d3', letterSpacing: 3 }}>
              GAINESVILLE, GEORGIA
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 74, fontWeight: 800, color: '#ffffff', lineHeight: 1.05 }}>
            Garage door repair
          </div>
          <div style={{ fontSize: 74, fontWeight: 800, color: '#e01937', lineHeight: 1.05 }}>
            done right the first time
          </div>
          <div style={{ fontSize: 28, color: '#c4d4e9', marginTop: 22 }}>
            Family owned since 1984 · Repairs · Openers · New doors
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              display: 'flex',
              background: '#c8102e',
              color: '#ffffff',
              fontSize: 38,
              fontWeight: 800,
              padding: '18px 34px',
              borderRadius: 12,
            }}
          >
            {business.phone.display}
          </div>
          <div style={{ fontSize: 26, color: '#94b0d3' }}>kauffmangarage.com</div>
        </div>
      </div>
    ),
    size
  )
}
