import { EnergySystem } from '@/components/energy-system/EnergySystem';
import { Hero } from '@/components/hero/Hero';
import { Craft } from '@/components/sections/Craft';
import { FinalCta } from '@/components/sections/FinalCta';
import { InvisibleEnergy } from '@/components/sections/InvisibleEnergy';
import { Process } from '@/components/sections/Process';
import { Projects } from '@/components/sections/Projects';
import { Solutions } from '@/components/sections/Solutions';
import { Trust } from '@/components/sections/Trust';

/**
 * Home page — the story runs 01 to 09 (§10).
 *
 * Projects and Trust render nothing while their data is empty, so the page
 * currently reads 01 → 06 → 09. That gap is deliberate: the sections return as
 * soon as documented content exists, and until then the flow stays honest
 * rather than padded.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <InvisibleEnergy />
      <EnergySystem />
      <Solutions />
      <Craft />
      <Process />
      <Projects />
      <Trust />
      <FinalCta />
    </>
  );
}
