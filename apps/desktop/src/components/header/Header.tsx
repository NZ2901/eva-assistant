export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-blue-500/10 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[0.4em]">
          EVA
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-green-400" />

        <span className="text-sm uppercase tracking-[0.2em] text-zinc-400">
          Online
        </span>
      </div>
    </header>
  );
}