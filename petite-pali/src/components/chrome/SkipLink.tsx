import styles from './SkipLink.module.css';

export function SkipLink() {
  return (
    <a href="#hauptinhalt" className={styles.link}>
      Zum Hauptinhalt springen
    </a>
  );
}
