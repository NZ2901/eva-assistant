import { KeyboardEvent, useState } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({
  onSend,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  function send() {
    const value = message.trim();

    if (!value) return;

    onSend(value);

    setMessage('');
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Enter') {
      send();
    }
  }

  return (
    <div
      className="
        mt-8
        flex
        w-full
        max-w-3xl
        items-center
        gap-3
        rounded-2xl
        border
        border-blue-500/15
        bg-[#121720]
        p-3
        transition-all

        focus-within:border-blue-400/40
        focus-within:shadow-[0_0_25px_rgba(59,130,246,.15)]
      "
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        type="text"
        placeholder="Pergunte qualquer coisa..."
        className="
          flex-1
          bg-transparent
          text-white
          outline-none
          placeholder:text-slate-500
        "
      />

      <button
        onClick={send}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-blue-600
          text-white
          transition-all

          hover:scale-105
          hover:bg-blue-500
        "
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  );
}