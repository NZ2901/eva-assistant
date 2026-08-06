import { ReactNode } from 'react';

interface AuroraBackgroundProps {
  children: ReactNode;
}

export function AuroraBackground({
  children,
}: AuroraBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070D]">
      {/* Glow azul */}
      <div
        className="
          absolute
          left-1/2
          top-1/3
          h-[700px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-blue-500/10
          blur-[160px]
        "
      />

      {/* Glow roxo */}
      <div
        className="
          absolute
          right-0
          top-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-400/5
          blur-[140px]
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}