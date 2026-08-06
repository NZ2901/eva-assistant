import { motion } from 'framer-motion';

interface OrbRingProps {
  size: number;
  duration?: number;
  rotation?: number;
  reverse?: boolean;
  dashed?: boolean;
}

export function OrbRing({
  size,
  duration = 20,
  rotation = 0,
  reverse = false,
  dashed = false,
}: OrbRingProps) {
  return (
    <motion.div
      animate={{
        rotate: reverse
          ? rotation - 360
          : rotation + 360,
      }}
      transition={{
        duration,
        ease: 'linear',
        repeat: Infinity,
      }}
      style={{
        width: size,
        height: size,
      }}
      className="absolute"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Halo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 6) / 2}
          fill="none"
          stroke="rgba(59,130,246,.08)"
          strokeWidth="8"
        />

        {/* Anel principal */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 6) / 2}
          fill="none"
          stroke="rgba(96,165,250,.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={
            dashed
              ? '18 18'
              : '130 520'
          }
        />

        {/* Reflexo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 6) / 2}
          fill="none"
          stroke="rgba(255,255,255,.18)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="20 620"
        />
      </svg>
    </motion.div>
  );
}