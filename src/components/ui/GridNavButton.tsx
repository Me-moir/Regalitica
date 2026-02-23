import { memo, useCallback, useMemo } from 'react';
import styles from './GridNavButton.module.css';
import type { AboutGridItem } from '@/data/Discover-data';

interface GridNavButtonProps {
  item: AboutGridItem;
  index: number;
  isActive: boolean;
  onClick: (key: AboutGridItem['key']) => void;
  onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const GridNavButton = memo<GridNavButtonProps>(({ item, index, isActive, onClick, onMouseMove }) => {
  const handleClick = useCallback(() => {
    onClick(item.key);
  }, [onClick, item.key]);

  const buttonStyle = useMemo(() => ({
    borderTop: index === 0 ? 'none' : '1px dashed var(--border-dashed)',
  }), [index]);

  return (
    <button
      onClick={handleClick}
      className={`${styles.gridButton} ${isActive ? styles.active : ''}`}
      style={buttonStyle}
      onMouseMove={onMouseMove}
    >
      <span className={styles.title}>
        {item.title}
      </span>
      
      {item.subtitle && (
        <span className={styles.subtitle}>
          {item.subtitle}
        </span>
      )}

      {!isActive && (
        <div className={styles.hoverGradient} />
      )}
    </button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.item.key === nextProps.item.key &&
    prevProps.index === nextProps.index
  );
});

GridNavButton.displayName = 'GridNavButton';

export default GridNavButton;