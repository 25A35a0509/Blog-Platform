import React from 'react';

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

const Spinner = ({ size = 'md', className = '', label = 'Loading…' }) => (
  <div role="status" className={`flex items-center justify-center ${className}`}>
    <span
      className={`inline-block ${sizeMap[size]} rounded-full border-primary-500 border-t-transparent animate-spin`}
    />
    <span className="sr-only">{label}</span>
  </div>
);

export default Spinner;
