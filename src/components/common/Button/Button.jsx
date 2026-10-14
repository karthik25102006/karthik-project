import React from 'react';
import './Button.css';

/**
 * Reusable Button Component for Life Translator
 * @param {('primary'|'secondary'|'outline'|'ghost')} variant - Visual style variant
 * @param {('sm'|'md'|'lg')} size - Button size
 * @param {React.ReactNode} children - Button label/content
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Disabled state
 * @param {string} type - Button type ('button', 'submit', 'reset')
 * @param {string} ariaLabel - Accessible label
 * @param {React.ReactNode} iconLeft - Optional icon placed before text
 * @param {React.ReactNode} iconRight - Optional icon placed after text
 * @param {string} className - Optional additional CSS class
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
  ariaLabel,
  iconLeft,
  iconRight,
  className = '',
  ...restProps
}) {
  const classNames = [
    'lt-btn',
    `lt-btn--${variant}`,
    `lt-btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...restProps}
    >
      {iconLeft && <span className="lt-btn__icon lt-btn__icon--left" aria-hidden="true">{iconLeft}</span>}
      <span className="lt-btn__label">{children}</span>
      {iconRight && <span className="lt-btn__icon lt-btn__icon--right" aria-hidden="true">{iconRight}</span>}
    </button>
  );
}

export default Button;
