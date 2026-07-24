import React from 'react';
import emptyStateImage from '@/assets/images/empty-state.svg';
import Button from './Button';

function EmptyState({
  title = 'Nothing here yet',
  description,
  imageSrc,
  ctaLabel,
  onCtaClick,
  ctaHref,
  className = '',
}) {
  const src = imageSrc || emptyStateImage;

  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-16 px-6 gap-4',
        className,
      ].join(' ')}
    >
      <img src={src} alt="" aria-hidden="true" className="h-40 w-auto opacity-80" />

      <div className="space-y-1 max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      {ctaLabel && (onCtaClick || ctaHref) && (
        ctaHref ? (
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {ctaLabel}
          </a>
        ) : (
          <Button variant="primary" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        )
      )}
    </div>
  );
}

export default EmptyState;
