import React from 'react';
import './Card.css';

/**
 * Reusable Card Component for Life Translator
 * @param {('default'|'interactive'|'elevated'|'accent')} variant - Card style
 * @param {('none'|'sm'|'md'|'lg')} padding - Internal spacing
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS class names
 * @param {function} onClick - Optional click handler (for interactive cards)
 */
export function Card({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  onClick,
  ...restProps
}) {
  const isInteractive = variant === 'interactive' || Boolean(onClick);
  const classNames = [
    'lt-card',
    `lt-card--${variant}`,
    `lt-card--pad-${padding}`,
    isInteractive ? 'lt-card--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      {...restProps}
    >
      {children}
    </div>
  );
}

export default Card;
