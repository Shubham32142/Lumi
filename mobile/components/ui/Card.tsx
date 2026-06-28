// Flat card: white surface, 1px solid border, lg radius, NO shadow (ui-standards).
import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: ReactNode;
  /** Use the larger space.6 padding instead of space.4. */
  roomy?: boolean;
  className?: string;
}

export function Card({ children, roomy = false, className, ...rest }: CardProps) {
  return (
    <View
      className={`bg-page border border-line rounded-lg ${
        roomy ? 'p-6' : 'p-4'
      } ${className ?? ''}`}
      {...rest}
    >
      {children}
    </View>
  );
}
