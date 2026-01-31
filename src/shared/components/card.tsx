import { type ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Card Component
 */

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export function Card({
  children,
  className,
  padding = 'md',
  hoverable = false,
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow',
        paddingStyles[padding],
        hoverable && 'transition-shadow hover:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Card Header
 */

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
}

/**
 * Card Title
 */

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={clsx('text-lg font-semibold', className)}>
      {children}
    </h3>
  );
}

/**
 * Card Content
 */

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
