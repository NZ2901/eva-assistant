import type { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  variant?: 'title' | 'subtitle' | 'body';
  className?: string;
}

export function Text({
  children,
  variant = 'body',
  className = '',
}: TextProps) {
  const variants = {
    title: 'text-5xl font-bold tracking-[0.3em] text-white',
    subtitle: 'text-2xl font-semibold text-white',
    body: 'text-base text-zinc-400',
  };

  return (
    <p className={`${variants[variant]} ${className}`}>
      {children}
    </p>
  );
}
