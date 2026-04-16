import React from 'react';

type IBoxProps = React.ComponentPropsWithoutRef<'div'> & { className?: string };

const Box = React.forwardRef<HTMLDivElement, IBoxProps>(function Box(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={className} {...props} />;
});

Box.displayName = 'Box';
export { Box };
