import { memo } from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TabButton = memo<TabButtonProps>(({ label, isActive, onClick, onMouseMove }) => {
  return (
    <div className={`tab-item ${isActive ? 'is-active' : ''}`}>
      <button
        onClick={onClick}
        onMouseMove={onMouseMove}
        className={`tab-label-btn ${isActive ? 'is-active' : ''}`}
      >
        {label}
      </button>
    </div>
  );
});

TabButton.displayName = 'TabButton';

export default TabButton;   