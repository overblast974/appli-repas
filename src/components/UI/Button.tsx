import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const classes = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <motion.div
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      style={{ display: 'inline-block' }}
    >
      <button
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="spinner" />
            <span>Chargement...</span>
          </>
        ) : (
          children
        )}
      </button>
    </motion.div>
  );
};
