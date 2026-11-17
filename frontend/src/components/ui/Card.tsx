import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hover }) => (
  <div
    onClick={onClick}
    className={clsx(
      'rounded-xl border border-gray-200 bg-white shadow-sm',
      hover && 'cursor-pointer hover:shadow-md transition-shadow',
      className,
    )}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('flex flex-col space-y-1 p-6', className)}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h3 className={clsx('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={clsx('p-6 pt-0', className)}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('flex items-center p-6 pt-0', className)}>{children}</div>
);
// add: CardDescription subcomponent
// fix: card shadow on focus-within
// add: ghost card variant
