import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <div className={icon ? 'input-icon' : ''}>
        {icon && (
          <div className="input-icon-element">
            {icon}
          </div>
        )}
        <input
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="input-error-message">{error}</p>
      )}
    </div>
  );
};
