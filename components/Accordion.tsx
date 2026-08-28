'use client';

import { useId, useState } from 'react';

export type AccordionItem = {
  title: string;
  body: string;
};

/**
 * Aufklappbare Liste.
 *
 * Der Knopf traegt "+" bzw. "−" als Schriftzeichen, kein Icon — die Vorgabe
 * schliesst Icons ausdruecklich aus. Trennlinien laufen ueber die
 * abgeleitete Hairline-Farbe: Carbon bei voller Deckung ist auf Vellum zu
 * hart, Weiss waere mit 1.15:1 unsichtbar.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="w-full">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <li key={item.title} className="border-t border-hairline last:border-b">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-subheading font-normal text-carbon-warm">
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-carbon-warm bg-paper-white text-body-sm leading-none text-carbon-warm"
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-6"
            >
              <p className="max-w-2xl text-body-sm text-text-muted">{item.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
