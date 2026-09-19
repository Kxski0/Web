import { Hero } from '@/components/hero/Hero';
import { BrandIntro } from '@/components/sections/BrandIntro';
import { Kategorien } from '@/components/sections/Kategorien';
import { GrowWithUs } from '@/components/grow/GrowWithUs';
import { EditorialSection } from '@/components/sections/EditorialSection';
import { StoreExperience } from '@/components/sections/StoreExperience';
import { AppointmentTeaser } from '@/components/sections/AppointmentTeaser';
import { GalleryTeaser } from '@/components/sections/GalleryTeaser';
import { PageCta } from '@/components/page/PageCta';
import { Button } from '@/components/ui/Button';
import { STROLLER } from '@/content/facts';
import { SITE } from '@/content/site';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: `${SITE.name} — ${SITE.descriptor} in Köln`,
  description: SITE.description,
  path: '/',
  image: '/images/boutique-fenster.webp',
  absoluteTitle: true,
});

/*
 * Modus: Persuade. Die Besucherin entscheidet sich und handelt — die Seite ist
 * hier das Produkt. Jeder Abschnitt trägt auf die eine Handlung am Ende zu:
 * vorbeikommen.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <Kategorien />
      <GrowWithUs />

      <EditorialSection
        id="fruehchen"
        label="Frühchen"
        title="Kleidung, die von Anfang an passt."
        image={IMAGES.wareSpieluhren}
        caption="Im Laden, nicht im Katalog: Frühchengrößen sind da, wenn sie gebraucht werden."
        actions={
          <>
            <Button href="/sortiment/fruehchen/">Frühchen entdecken</Button>
            <Button href="/kontakt/" variant="quiet">
              Persönliche Beratung
            </Button>
          </>
        }
      >
        <p>
          Frühchenkleidung fängt bei Größe 44 an — unterhalb dessen, wo die meisten Sortimente
          überhaupt beginnen. Wer sie sucht, sucht sie selten in Ruhe, sondern meist zwischen
          Klinik und Zuhause.
        </p>
        <p>
          Deshalb liegt sie hier im Regal und nicht in einer Bestellliste. Welche Größen gerade da
          sind, sagen wir am Telefon in einer Minute.
        </p>
      </EditorialSection>

      <EditorialSection
        id="fuer-mama"
        label="Für Mama"
        title="Schwanger. Schön. Du."
        image={IMAGES.boutiqueRegalwand}
        reverse
        tinted
        actions={<Button href="/sortiment/fuer-mama/">Umstandsmode ansehen</Button>}
      >
        <p>
          Umstands- und Stillmode gehört in denselben Laden wie die Erstausstattung. Wer für das
          Kind kommt, soll für sich selbst nicht noch woanders hin müssen.
        </p>
        <p>
          Dieselben Maßstäbe wie beim Rest: Naturfasern, ordentliche Schnitte, Sachen, die nach
          dem Waschen noch sitzen.
        </p>
      </EditorialSection>

      <EditorialSection
        id="tragehilfen"
        label="Trageberatung"
        title="Welche Trage passt zu euch?"
        image={IMAGES.boutiqueBeratung}
        caption="Am Tisch zwischen den Stangen wird angelegt, eingestellt und ausprobiert."
        actions={<Button href="/sortiment/tragehilfen/">Trageberatung entdecken</Button>}
      >
        <p>
          Eine Tragehilfe lässt sich nicht aus einer Produktbeschreibung auswählen. Was passt,
          hängt vom Rücken ab, vom Kind, vom Alltag — und davon, wie es sich nach zwanzig Minuten
          anfühlt, nicht nach zwanzig Sekunden.
        </p>
        <p>
          Deshalb werden die Systeme hier angelegt, eingestellt und ausprobiert. Mit dem eigenen
          Kind, im Laden, ohne Zeitdruck.
        </p>
      </EditorialSection>

      <EditorialSection
        id="kinderwagen"
        label="Kinderwagen"
        title="Nicht nur anschauen. Ausprobieren."
        image={IMAGES.boutiqueGang}
        reverse
        tinted
        actions={<Button href="/sortiment/kinderwagen/">Kinderwagen entdecken</Button>}
      >
        <p>
          Petite Pali ist {STROLLER.role}. Das heißt: {STROLLER.brand} steht hier nicht als Bild in
          einem Prospekt, sondern als Wagen im Laden.
        </p>
        <p>
          Schieben, falten, hochheben, einmal in den Kofferraum stellen. Erst dabei zeigt sich, ob
          ein Wagen zum Alltag passt — und das ist genau die Frage, die eine Produktseite nicht
          beantworten kann.
        </p>
      </EditorialSection>

      <StoreExperience />
      <AppointmentTeaser />
      <GalleryTeaser />

      {/*
        * Die Seite endet auf genau einer Handlung. Zuvor lief sie im
        * Galerie-Streifen aus — schön anzusehen, aber ohne Antwort auf die
        * Frage, was jetzt zu tun ist.
        */}
      <PageCta
        title="Kommen Sie vorbei."
        body="Karolingerring 5, am Chlodwigplatz. Wer etwas Bestimmtes sucht, ruft am besten kurz vorher an — das spart den Weg."
      />
    </>
  );
}
