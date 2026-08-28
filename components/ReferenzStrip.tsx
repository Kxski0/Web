import { referenzen } from '@/content/referenzen';
import { Reveal } from './Reveal';
import { SectionLabel } from './SectionLabel';

/**
 * Kundenreferenzen.
 *
 * Solange keine echten Kundenaussagen vorliegen, werden ausschliesslich die
 * Kundennamen gezeigt. Zitate zu erfinden und sie namentlich genannten
 * Unternehmen zuzuschreiben, waere eine Falschdarstellung — die Section
 * schaltet automatisch auf Zitate um, sobald sie in content/referenzen.ts
 * hinterlegt sind.
 */
export function ReferenzStrip() {
  const mitZitat = referenzen.filter((r) => r.zitat);

  if (mitZitat.length > 0) {
    return (
      <ul className="grid gap-12 md:grid-cols-2">
        {mitZitat.map((r, i) => (
          <Reveal as="li" key={r.name} delay={i * 80}>
            <blockquote className="text-subheading font-light text-carbon-warm">
              „{r.zitat}“
            </blockquote>
            <p className="mt-4 text-body-sm text-text-muted">
              {r.name}
              {r.branche ? ` — ${r.branche}` : ''}
            </p>
          </Reveal>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <SectionLabel className="mb-8">KUNDEN UNTER ANDEREM</SectionLabel>
      <ul className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {referenzen.map((r, i) => (
          <Reveal as="li" key={r.name} delay={i * 70}>
            <p className="text-subheading font-light text-carbon-warm">{r.name}</p>
            {r.branche ? (
              <p className="mt-1 text-body-sm text-text-muted">{r.branche}</p>
            ) : null}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
