import { ActivityIndicator } from 'react-native';
import React from 'react';
import { cssInterop } from 'nativewind';

cssInterop(ActivityIndicator, {
  className: { target: 'style', nativeStyleToProp: { color: true } },
});

type SpinnerProps = {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
};

const Spinner = React.forwardRef<ActivityIndicator, SpinnerProps>(
  ({ size = 'large', color = 'gray', className }, ref) => {
    return (
      <ActivityIndicator
        ref={ref}
        size={size}
        color={color}
        className={className}
      />
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };
