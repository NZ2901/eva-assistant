import { motion } from 'framer-motion';

export function OrbCore() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.04, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full"
    >
      {/* Glow interno */}
      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />

      {/* Esfera principal */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200 via-blue-500 to-blue-800" />

      {/* Reflexo superior */}
      <div className="absolute left-8 top-6 h-8 w-8 rounded-full bg-white/40 blur-md" />

      {/* Núcleo */}
      <div className="absolute h-10 w-10 rounded-full bg-white/20 blur-sm" />

      {/* Borda brilhante */}
      <div className="absolute inset-0 rounded-full border border-blue-200/40" />
    </motion.div>
  );
}