import { motion } from 'framer-motion';

interface OrbGlowProps {
  scale: number;
  opacity: number;
}

export function OrbGlow({
  scale,
  opacity,
}: OrbGlowProps) {
  return (
    <motion.div
      animate={{
        scale: [scale, scale + 0.04, scale],
        opacity: [opacity, opacity + 0.08, opacity],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        pointer-events-none
      "
    >
      {/* Glow principal */}
      <div
        className="
          absolute
          h-[340px]
          w-[340px]
          rounded-full
          bg-blue-500/25
          blur-[90px]
        "
      />

      {/* Glow intermediário */}
      <div
        className="
          absolute
          h-[250px]
          w-[250px]
          rounded-full
          bg-cyan-300/15
          blur-[60px]
        "
      />

      {/* Núcleo de luz */}
      <div
        className="
          absolute
          h-[170px]
          w-[170px]
          rounded-full
          bg-white/10
          blur-[30px]
        "
      />
    </motion.div>
  );
}