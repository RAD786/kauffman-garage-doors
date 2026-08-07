/**
 * Renders JSON-LD. Kept in one place so every page emits it identically.
 *
 * `<script type="application/ld+json">` content is not executed as JS, and the
 * only injection vector would be a `</script>` sequence inside our own data
 * files -- escaped below regardless.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const payload = Array.isArray(data) ? data : [data]

  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}
