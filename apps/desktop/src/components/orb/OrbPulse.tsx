import { motion } from 'framer-motion';

interface OrbPulseProps {
  duration: number;
}

export function OrbPulse({
  duration,
}: OrbPulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.12, 1],
        opacity: [0.12, 0.28, 0.12],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="
        absolute
        h-[340px]
        w-[340px]
        rounded-full
        border
        border-blue-400/20
      "
    />
  );
}