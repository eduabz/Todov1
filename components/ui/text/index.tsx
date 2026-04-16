import React from 'react';
import { Text as RNText } from 'react-native';

type ITextProps = React.ComponentProps<typeof RNText> & { className?: string };

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  function Text({ className, ...props }, ref) {
    return <RNText {...props} className={className} ref={ref} />;
  }
);

Text.displayName = 'Text';

export { Text };
