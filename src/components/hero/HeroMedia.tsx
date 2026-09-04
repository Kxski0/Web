import styles from './Hero.module.css';

/**
 * Hero imagery.
 *
 * Served through <picture> rather than next/image because the two viewports need
 * two different CROPS, not two sizes — on a phone the landscape frame would put
 * the building off-screen. AVIF leads, WebP follows, and the whole set is
 * pre-generated (scripts/hero-variants.mjs).
 *
 * VIDEO BLUEPRINT (§33): this element is the seam. A scroll-controlled hero video
 * replaces the <picture> below with a muted, playsInline <video> carrying
 * poster={landscape 1536 webp}; nothing else in the layout changes, because the
 * frame, the scrims and the parallax wrapper are all independent of the media
 * type. Storyboard: 0–20% settle, 20–40% approach, 40–60% the array reads,
 * 60–80% the technical layer hints, 80–100% pull back. 8–12s, 24fps, 4K master,
 * playback head bound to scroll progress; the portrait crop gets its own encode.
 */
export function HeroMedia() {
  return (
    <div className={styles.media} aria-hidden="true">
      <div className={styles.parallax} data-hero-parallax>
        <picture>
          <source
            media="(max-width: 47.999rem)"
            type="image/avif"
            srcSet="/images/hero-energy-system-portrait-512.avif 512w, /images/hero-energy-system-portrait-768.avif 768w"
            sizes="100vw"
          />
          <source
            media="(max-width: 47.999rem)"
            type="image/webp"
            srcSet="/images/hero-energy-system-portrait-512.webp 512w, /images/hero-energy-system-portrait-768.webp 768w"
            sizes="100vw"
          />
          <source
            type="image/avif"
            srcSet="/images/hero-energy-system-768.avif 768w, /images/hero-energy-system-1152.avif 1152w, /images/hero-energy-system-1536.avif 1536w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/images/hero-energy-system-768.webp 768w, /images/hero-energy-system-1152.webp 1152w, /images/hero-energy-system-1536.webp 1536w"
            sizes="100vw"
          />
          <img
            src="/images/hero-energy-system-1536.webp"
            /* Decorative here: the headline beside it carries the same meaning,
               and the section is described by its heading. */
            alt=""
            width={1536}
            height={1024}
            fetchPriority="high"
            decoding="async"
            className={styles.image}
            data-hero-image
          />
        </picture>
      </div>

      {/* Directional scrim. Sized so the headline holds contrast against the
          brightest pixels the photograph can put behind it, not against its
          average. Verified by sampling, not by eye. */}
      <div className={styles.scrimDirectional} />
      <div className={styles.scrimHeadline} />
      <div className={styles.scrimBottom} />
      <div className={styles.scrimTop} />
    </div>
  );
}
