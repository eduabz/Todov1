import React from 'react';

type ITextProps = React.ComponentProps<'span'> & { className?: string };

const Text = React.forwardRef<React.ComponentRef<'span'>, ITextProps>(
  function Text({ className, ...props }, ref) {
    return <span {...props} className={className} ref={ref} />;
  }
);

Text.displayName = 'Text';

export { Text };
