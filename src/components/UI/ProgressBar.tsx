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
  return (
    <div className="progress-container">
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && <span className="progress-percentage">{progress.toFixed(0)}%</span>}
        </div>
      )}
      <div className="progress-bar-track">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`progress-bar-fill progress-bar-${color}`}
        />
      </div>
    </div>
  );
};
