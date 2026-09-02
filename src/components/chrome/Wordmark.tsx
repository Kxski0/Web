import Image from 'next/image';
import styles from './Wordmark.module.css';

/**
 * Brand mark, chosen by the surface it sits on.
 *
 * The supplied logo is drawn for light backgrounds: measured against the site's
 * graphite ground, 50.2% of its visible artwork falls below 3:1 contrast —
 * the "Bau" of the wordmark, the house and the module are all near-black and
 * would simply disappear, leaving "Sol Tec" floating under a sun.
 *
 * Rather than recolour someone's logo without being asked, the component uses
 * the real artwork wherever the ground is light and falls back to a typographic
 * wordmark on dark. This is interim: the proper fix is the official negative
 * version of the logo, which is requested in CONTENT-TODO.md.
 */
export function Wordmark({ variant = 'auto' }: { variant?: 'auto' | 'light' | 'type' }) {
  if (variant === 'type') {
    return <TypeWordmark />;
  }

  // The footer has room for the full lockup; the header bar does not, and the
  // descriptor line would render around five pixels tall there.
  const full = variant === 'light';
  const src = full
    ? '/images/brand/solbautec-logo.webp'
    : '/images/brand/solbautec-logo-compact.webp';

  return (
    <span className={styles.root} data-variant={variant}>
      <Image
        src={src}
        alt="SolBauTec"
        width={full ? 1200 : 900}
        height={full ? 578 : 395}
        priority
        className={styles.logo}
      />
      <span className={styles.fallback} aria-hidden="true">
        <TypeWordmark />
      </span>
    </span>
  );
}

function TypeWordmark() {
  return <span className={styles.type}>SOLBAUTEC</span>;
}
