import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'relative rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variants = {
    primary: `
      bg-gradient-to-r from-primary-600 to-accent-500
      hover:from-primary-700 hover:to-accent-600
      dark:from-primary-500 dark:to-accent-400
      dark:hover:from-primary-600 dark:hover:to-accent-500
      text-white shadow-lg shadow-primary-500/30
      hover:shadow-xl hover:shadow-primary-500/40
      hover:scale-105 active:scale-95
    `,
    secondary: `
      glass-card
      text-gray-800 dark:text-gray-200
      hover:bg-white/80 dark:hover:bg-slate-800/80
      hover:scale-105 active:scale-95
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-500
      hover:from-red-700 hover:to-red-600
      text-white shadow-lg shadow-red-500/30
      hover:shadow-xl hover:shadow-red-500/40
      hover:scale-105 active:scale-95
    `,
    ghost: `
      hover:bg-white/50 dark:hover:bg-slate-800/50
      text-gray-700 dark:text-gray-300
      hover:scale-105 active:scale-95
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Shimmer effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      )}

      <span className="relative z-10">{children}</span>
    </button>
  );
};
