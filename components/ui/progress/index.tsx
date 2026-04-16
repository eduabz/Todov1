import React from 'react';
import { View } from 'react-native';

type ProgressProps = {
  value: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
};

type ProgressFilledTrackProps = {
  className?: string;
};

const sizeClasses = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const Progress = React.forwardRef<View, ProgressProps>(
  ({ value, size = 'md', className }, ref) => {
    return (
      <View
        ref={ref}
        className={`bg-gray-300 rounded-full w-full ${sizeClasses[size]} ${className || ''}`}
      >
        <View
          className="bg-blue-600 rounded-full h-full"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </View>
    );
  }
);

const ProgressFilledTrack = React.forwardRef<View, ProgressFilledTrackProps>(
  ({ className }, ref) => {
    return <View ref={ref} className={`bg-blue-600 rounded-full ${className || ''}`} />;
  }
);

export { Progress, ProgressFilledTrack };
