import type { ReactNode } from 'react';

import { theme } from '../../../styles';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({
  children,
  className = '',
}: GlassCardProps) {
  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadows.card,
        backdropFilter: 'blur(18px)',
      }}
      className={`
        relative
        overflow-hidden
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-blue-400/40
        hover:shadow-[0_0_30px_rgba(59,130,246,.15)]

        ${className}
      `}
    >
      {/* canto superior esquerdo */}
      <div className="absolute left-0 top-0 h-4 w-4 border-l border-t border-blue-400/40" />

      {/* canto superior direito */}
      <div className="absolute right-0 top-0 h-4 w-4 border-r border-t border-blue-400/40" />

      {/* canto inferior esquerdo */}
      <div className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-blue-400/40" />

      {/* canto inferior direito */}
      <div className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-blue-400/40" />

      {children}
    </div>
  );
}
