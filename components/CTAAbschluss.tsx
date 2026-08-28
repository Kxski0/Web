import { abschlussCta } from '@/content/startseite';
import { DisplayHeading } from './DisplayHeading';
import { Button } from './Button';
import { Reveal } from './Reveal';

/** Abschliessender Handlungsaufruf auf der dunkelsten Flaeche vor dem Footer. */
export function CTAAbschluss() {
  return (
    <section className="surface-dark bg-carbon-warm py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <DisplayHeading inverse className="max-w-2xl">
            {abschlussCta.headline}
          </DisplayHeading>
          <p className="mt-6 max-w-xl text-body text-paper-white/70">
            {abschlussCta.subline}
          </p>
          <div className="mt-10">
            <Button href={abschlussCta.cta.href} variant="invers">
              {abschlussCta.cta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
