import React from 'react';

const shapeClasses = {
  text: 'h-4 w-full rounded',
  heading: 'h-6 w-3/4 rounded',
  avatar: 'h-10 w-10 rounded-full',
  thumbnail: 'h-40 w-full rounded-lg',
  button: 'h-9 w-24 rounded-md',
  card: 'h-48 w-full rounded-xl',
  custom: '',
};

function Skeleton({
  shape = 'text',
  width,
  height,
  className = '',
  count = 1,
}) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const base = [
    'animate-pulse bg-gray-200',
    shapeClasses[shape] ?? shapeClasses.text,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (count === 1) {
    return <span aria-hidden="true" className={base} style={style} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} aria-hidden="true" className={base} style={style} />
      ))}
    </>
  );
}

function SkeletonGroup({ children, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`} aria-busy="true" aria-label="Loading">
      {children}
    </div>
  );
}

Skeleton.Group = SkeletonGroup;

export default Skeleton;
