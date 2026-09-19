import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealText } from '@/components/motion/RevealText';
import styles from './Willkommen.module.css';

export function Willkommen() {
  return (
    <section className={styles.section} id="willkommen">
      <div className={`${styles.grid} page-grid`}>
        <div className={styles.head}>
          <Eyebrow index="02">Die Boutique</Eyebrow>
          <RevealText as="h2" className={styles.title}>
            Ein Laden, in dem man die Sachen anfassen kann.
          </RevealText>
        </div>

        <div className={styles.body}>
          <p>
            Petite Pali liegt am Chlodwigring, ein paar Schritte vom Chlodwigplatz. Der Laden ist
            klein genug, dass man ihn in zehn Minuten gesehen hat, und voll genug, dass man länger
            bleibt.
          </p>
          <p>
            Was hier hängt, ist einzeln ausgesucht: Stoffe, die den fünften Waschgang überstehen,
            Schnitte, die ein Kind selbst anbekommt, Spielzeug, das nach einem Jahr noch benutzt
            wird. Neben der neuen Ware steht gut erhaltene Secondhand-Kleidung — im selben Regal,
            nach denselben Maßstäben geprüft.
          </p>
          <p>
            Beraten wird, wer beraten werden möchte. Wer nur schauen will, darf auch nur schauen.
          </p>
        </div>
      </div>
    </section>
  );
}
