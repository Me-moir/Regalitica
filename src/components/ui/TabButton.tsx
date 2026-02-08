import { memo } from 'react';
import styles from './TabButton.module.css';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TabButton = memo<TabButtonProps>(({ label, isActive, onClick, onMouseMove }) => {
  return (
    <button
      onClick={onClick}
      onMouseMove={onMouseMove}
      className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
    >
      {label}
    </button>
  );
});

TabButton.displayName = 'TabButton';

export default TabButton;   