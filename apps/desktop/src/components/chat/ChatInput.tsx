import { SendHorizonal } from 'lucide-react';

export function ChatInput() {
  return (
    <div className="mt-8 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
      <input
        type="text"
        placeholder="Digite uma mensagem..."
        className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
      />

      <button
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-blue-600
          transition
          hover:bg-blue-500
        "
      >
        <SendHorizonal size={18} />
      </button>
    </div>
  );
}