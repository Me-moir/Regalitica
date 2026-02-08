import { memo } from 'react';
import styles from './LearnMoreButton.module.css';

interface LearnMoreButtonProps {
  href: string;
  onMouseMove: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const LearnMoreButton = memo<LearnMoreButtonProps>(({ href, onMouseMove }) => {
  return (
    <a
      href={href}
      className={styles.learnMoreButton}
      onMouseMove={onMouseMove}
    >
      <span>Learn More</span>
      <i className="bi bi-arrow-up-right-square"></i>
    </a>
  );
});

LearnMoreButton.displayName = 'LearnMoreButton';

export default LearnMoreButton;