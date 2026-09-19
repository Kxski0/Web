import { RevealText } from '@/components/motion/RevealText';
import styles from './SectionHeading.module.css';

type Props = {
  label?: string;
  title: string;
  lede?: string;
  as?: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center';
};

export function SectionHeading({ label, title, lede, as = 'h2', align = 'left' }: Props) {
  return (
    <div className={`${styles.head} ${align === 'center' ? styles.center : ''}`}>
      {label && (
        <p className={styles.label}>
          <span className={styles.rule} aria-hidden="true" />
          {label}
        </p>
      )}
      <RevealText as={as} className={styles.title}>
        {title}
      </RevealText>
      {lede && <p className={styles.lede}>{lede}</p>}
    </div>
  );
}
