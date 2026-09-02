import { PROJECTS } from '@/content/projects';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealImage } from '@/components/motion/RevealImage';
import { IMAGES, type ImageSlotName } from '@/lib/assets';
import styles from './Projects.module.css';

/**
 * Section 07 — reference projects.
 *
 * Renders NOTHING while no documented project exists. Not an empty state, not a
 * "coming soon", not a stock photograph with invented specifications: an absent
 * section is honest, a fabricated reference is not (§43). The markup below is
 * ready for the moment real projects are supplied — see CONTENT-TODO.md.
 */
export function Projects() {
  if (PROJECTS.length === 0) return null;

  return (
    <section id="projekte" className={styles.section} aria-labelledby="projects-headline">
      <div className={`${styles.intro} page-grid`}>
        <div className={styles.introText}>
          <Eyebrow index="07">Projekte</Eyebrow>
          <h2 id="projects-headline" className={styles.headline}>
            Gebaut, nicht gerendert.
          </h2>
        </div>
      </div>

      <div className={styles.list}>
        {PROJECTS.map((project) => {
          const slot = IMAGES[project.image as ImageSlotName];
          return (
            <article key={project.slug} className={`${styles.item} page-grid`}>
              <div className={styles.media}>
                {slot && <RevealImage slot={slot} className={styles.frame} sizes="100vw" />}
              </div>
              <dl className={styles.meta}>
                <div className={styles.metaRow}>
                  <dt>Standort</dt>
                  <dd>{project.location}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt>Gebäude</dt>
                  <dd>{project.buildingType}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt>System</dt>
                  <dd>{project.system.join(' · ')}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt>Umsetzung</dt>
                  <dd>{project.completed}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt>Ergebnis</dt>
                  <dd>{project.outcome}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}
