'use client';

import React from 'react';

type CircularLoadingSpinnerProps = {
  size?: number; // diameter in px
  strokeWidth?: number; // thickness
  progress?: number;
};

const CircularLoadingSpinner: React.FC<CircularLoadingSpinnerProps> = ({
  size = 48,
  strokeWidth = 4,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex justify-center items-center h-screen mx-auto">
      <svg
        width={size}
        height={size}
        className="animate-spin"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-green-500"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default CircularLoadingSpinner;
