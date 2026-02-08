import { memo } from 'react';
import styles from './AffiliationRow.module.css';

interface AffiliationRowProps {
  id: string;
  name: string;
  dateJoined: string;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const AffiliationRow = memo<AffiliationRowProps>(({ id, name, dateJoined, onMouseMove }) => {
  return (
    <div
      className={styles.affiliationRow}
      onMouseMove={onMouseMove}
    >
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🏢</span>
      </div>
      <div className={styles.name}>{name}</div>
      <div className={styles.date}>{dateJoined}</div>
    </div>
  );
});

AffiliationRow.displayName = 'AffiliationRow';

export default AffiliationRow;