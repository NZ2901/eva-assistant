export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[#16213D] pb-6">
      <div>
        <h1 className="text-4xl font-bold tracking-[0.45em]">
          EVA
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Sua assistente inteligente
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-[#244C9C] px-5 py-2">
        <div className="h-2 w-2 rounded-full bg-emerald-400" />

        <span className="tracking-[0.3em] text-sm text-slate-300">
          ONLINE
        </span>
      </div>
    </header>
  );
}