import { memo } from 'react';

interface LearnMoreButtonProps {
  href: string;
  onMouseMove: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const LearnMoreButton = memo<LearnMoreButtonProps>(({ href, onMouseMove }) => {
  return (
    <div className="tab-item">
      <a
        href={href}
        className="tab-label-btn"
        onMouseMove={onMouseMove}
      >
        <span>Learn More</span>
        <i className="bi bi-arrow-up-right-square"></i>
      </a>
    </div>
  );
});

LearnMoreButton.displayName = 'LearnMoreButton';

export default LearnMoreButton;