import React from 'react';
import './Badge.css';

/**
 * Reusable Badge / Tag Component
 * @param {('teal'|'navy'|'neutral'|'success'|'warning')} variant
 * @param {('sm'|'md')} size
 * @param {React.ReactNode} children
 * @param {string} className
 */
export function Badge({
  variant = 'teal',
  size = 'md',
  children,
  className = '',
  ...restProps
}) {
  const classNames = [
    'lt-badge',
    `lt-badge--${variant}`,
    `lt-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...restProps}>
      {children}
    </span>
  );
}

export default Badge;
