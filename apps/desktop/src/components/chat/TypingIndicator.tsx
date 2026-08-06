import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="
          flex
          items-center
          gap-2
          rounded-3xl
          border
          border-blue-500/10
          bg-[#141821]
          px-5
          py-4
        "
      >
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 0.8,
              delay: dot * 0.2,
              repeat: Infinity,
            }}
            className="h-2 w-2 rounded-full bg-blue-400"
          />
        ))}
      </div>
    </div>
  );
}