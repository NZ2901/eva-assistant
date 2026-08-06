import { LucideIcon } from 'lucide-react';

interface InfoPanelProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
}

export function InfoPanel({
  title,
  value,
  subtitle = 'Connected',
  icon: Icon,
}: InfoPanelProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-blue-500/10
        bg-gradient-to-b
        from-[#141821]
        to-[#10131A]
        p-7
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-blue-400/30
        hover:shadow-[0_0_40px_rgba(59,130,246,.15)]
      "
    >
      {/* Glow */}
      <div
        className="
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-blue-500/10
          blur-3xl
          opacity-0
          transition
          duration-500
          group-hover:opacity-100
        "
      />

      {/* Ícone */}
      <div
        className="
          mb-6
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-blue-500/10
          text-blue-300
        "
      >
        <Icon size={22} />
      </div>

      {/* Título */}
      <p
        className="
          mb-3
          text-xs
          uppercase
          tracking-[0.45em]
          text-blue-300/60
        "
      >
        {title}
      </p>

      {/* Valor */}
      <h3
        className="
          text-4xl
          font-semibold
          leading-tight
          text-white
        "
      >
        {value}
      </h3>

      {/* Status */}
      <div className="mt-6 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-400" />

        <span className="text-sm text-slate-400">
          {subtitle}
        </span>
      </div>
    </div>
  );
}