import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  color = 'primary',
  showPercentage = true,
}) => {
  const colorClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>}
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${colorClasses[color]}`}
        />
      </div>
    </div>
  );
};
