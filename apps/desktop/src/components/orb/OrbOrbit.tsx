import { motion } from 'framer-motion';

interface OrbOrbitProps {
  size: number;
  duration: number;
  reverse?: boolean;
  particles: number;
}

export function OrbOrbit({
  size,
  duration,
  reverse = false,
  particles,
}: OrbOrbitProps) {
  return (
    <motion.div
      animate={{
        rotate: reverse ? -360 : 360,
      }}
      transition={{
        duration,
        ease: 'linear',
        repeat: Infinity,
      }}
      className="absolute flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      {Array.from({ length: particles }).map((_, index) => {
        const angle = (360 / particles) * index;

        // Tamanho diferente para cada partícula
        const particleSize = [5, 7, 4, 8, 6][index % 5];

        // Intensidade diferente
        const opacity = [0.5, 0.9, 0.7, 1, 0.6][index % 5];

        return (
          <div
            key={index}
            className="absolute"
            style={{
              transform: `rotate(${angle}deg) translateY(-${size / 2}px)`,
            }}
          >
            <motion.div
              animate={{
                scale: [0.8, 1.3, 0.8],
                opacity: [opacity * 0.5, opacity, opacity * 0.5],
              }}
              transition={{
                duration: 2 + index * 0.25,
                delay: index * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: particleSize,
                height: particleSize,
              }}
              className="
                relative
                rounded-full
                bg-blue-200
              "
            >
              {/* Glow */}
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-blue-300/70
                  blur-[6px]
                  scale-[2]
                "
              />

              {/* Núcleo */}
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-blue-100
                "
              />
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}