import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  overlay = false,
  className = '',
  ...props 
}) => {
  const spinnerClass = [
    'spinner',
    `spinner--${size}`,
    `spinner--${color}`,
    className
  ].filter(Boolean).join(' ');

  const spinner = (
    <div className={spinnerClass} {...props}>
      <div className="spinner__circle"></div>
    </div>
  );

  if (overlay) {
    return (
      <div className="spinner-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;