import type { ButtonHTMLAttributes } from 'react';

export function DrawerButton({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`drawer-button ${className}`} {...props} />;
}