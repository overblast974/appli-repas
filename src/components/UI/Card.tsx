import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
}) => {
  const classes = `${glass ? 'card-glass' : 'card'} ${hover ? 'card-hover' : ''} ${className}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={classes}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
