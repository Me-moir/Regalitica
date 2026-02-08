import { memo } from 'react';
import styles from './ExecutiveCard.module.css';

interface ExecutiveCardProps {
  id: string;
  position: string;
  initials: string;
  name: string;
  department?: string;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ExecutiveCard = memo<ExecutiveCardProps>(({ 
  id, 
  position, 
  initials, 
  name, 
  department, 
  onMouseMove 
}) => {
  return (
    <div
      className={styles.executiveCard}
      onMouseMove={onMouseMove}
      data-private="true"
      data-nosnippet="true"
    >
      {/* Portrait Placeholder */}
      <div className={styles.portraitPlaceholder}>
        <span className={styles.initialsText}>{initials}</span>
      </div>
      
      {/* Executive Info */}
      <div className={styles.executiveInfo}>
        <h3 
          className={styles.name}
          data-nosnippet="true"
        >
          {name.split('').map((char, idx) => (
            <span key={idx} data-char="obfuscated">
              {char}
              {idx < name.length - 1 && <span style={{fontSize: 0}}>&#8203;</span>}
            </span>
          ))}
        </h3>
        <h4 
          className={styles.position}
          data-nosnippet="true"
        >
          {position.split('').map((char, idx) => (
            <span key={idx} data-char="obfuscated">
              {char}
              {idx < position.length - 1 && <span style={{fontSize: 0}}>&#8203;</span>}
            </span>
          ))}
        </h4>
        {department && (
          <p 
            className={styles.department}
            data-nosnippet="true"
          >
            {department}
          </p>
        )}
      </div>
    </div>
  );
});

ExecutiveCard.displayName = 'ExecutiveCard';

export default ExecutiveCard;