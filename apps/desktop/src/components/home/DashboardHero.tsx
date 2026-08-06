import {
  ArrowRight,
  Brain,
  Cpu,
  Sparkles,
} from 'lucide-react';

import { GlassCard } from '../ui/GlassCard';

const suggestions = [
  'Criar automação',
  'Explicar NestJS',
  'Abrir memória',
  'Conversar com a EVA',
];

export function DashboardHero() {
  return (
    <GlassCard className="relative overflow-hidden rounded-[36px] p-12">
      {/* Glow de fundo */}
      <div
        className="
          absolute
          -right-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-blue-500/10
          blur-3xl
        "
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <Sparkles
            size={18}
            className="text-cyan-300"
          />

          <span className="text-sm uppercase tracking-[0.45em] text-blue-300/60">
            EVA AI CORE
          </span>
        </div>

        <h2 className="mt-6 text-5xl font-bold leading-tight text-white">
          Bom dia, João 👋
        </h2>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
          Estou pronta para ajudar você a desenvolver software,
          automatizar processos, responder perguntas e organizar
          seus projetos em um único lugar.
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <Cpu
                size={22}
                className="text-blue-300"
              />

              <span className="text-xs uppercase tracking-[0.35em] text-blue-300/60">
                Modelo
              </span>
            </div>

            <h3 className="text-xl font-semibold text-white">
              Gemini 2.5 Flash
            </h3>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles
                size={22}
                className="text-emerald-400"
              />

              <span className="text-xs uppercase tracking-[0.35em] text-blue-300/60">
                Status
              </span>
            </div>

            <h3 className="text-xl font-semibold text-emerald-400">
              Online
            </h3>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <Brain
                size={22}
                className="text-violet-300"
              />

              <span className="text-xs uppercase tracking-[0.35em] text-blue-300/60">
                Memória
              </span>
            </div>

            <h3 className="text-xl font-semibold text-white">
              124 registros
            </h3>
          </GlassCard>
        </div>

        {/* Linha */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Sugestões */}
        <div>
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-blue-300/60">
            Comece por aqui
          </p>

          <div className="flex flex-wrap gap-4">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-blue-500/20
                  bg-blue-500/5
                  px-6
                  py-4
                  text-white/80
                  transition-all
                  duration-300

                  hover:-translate-y-1
                  hover:border-blue-400/40
                  hover:bg-blue-500/10
                  hover:text-white
                "
              >
                {suggestion}

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}