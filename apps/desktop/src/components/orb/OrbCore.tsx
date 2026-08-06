import { motion } from 'framer-motion';

export function OrbCore() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.03, 1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="
        relative
        z-20
        flex
        h-52
        w-52
        items-center
        justify-center
      "
    >
      {/* Glow externo */}
      <div
        className="
          absolute
          -inset-8
          rounded-full
          bg-blue-500/20
          blur-3xl
        "
      />

      {/* Esfera */}
      <div
        className="
          relative
          h-full
          w-full
          overflow-hidden
          rounded-full
        "
      >
        {/* Gradiente principal */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            bg-[radial-gradient(circle_at_30%_20%,#eef7ff_0%,#8ab9ff_45%,#4d89f7_100%)]
          "
        />

        {/* Sombra interna */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            shadow-[inset_0_-30px_60px_rgba(0,0,0,.18)]
          "
        />

        {/* Reflexo superior */}
        <div
          className="
            absolute
            left-8
            top-6
            h-16
            w-24
            rounded-full
            bg-white/35
            blur-xl
            rotate-[-18deg]
          "
        />

        {/* Reflexo lateral */}
        <div
          className="
            absolute
            right-10
            bottom-10
            h-8
            w-8
            rounded-full
            bg-white/10
            blur-md
          "
        />

        {/* Borda iluminada */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            border
            border-white/10
          "
        />

        {/* Halo interno */}
        <div
          className="
            absolute
            inset-4
            rounded-full
            border
            border-white/5
          "
        />
      </div>
    </motion.div>
  );
}