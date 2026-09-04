import styles from './SkipLink.module.css';

export function SkipLink() {
  return (
    <a href="#hauptinhalt" className={styles.skip}>
      Zum Hauptinhalt springen
    </a>
  );
}
