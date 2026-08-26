import {
  useEffect,
  useRef,
  useState,
} from 'react';
import type { KeyboardEvent } from 'react';

import {
  Mic,
  MicOff,
  SendHorizontal,
} from 'lucide-react';

import { useVoice } from '../../hooks/useVoice';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] =
    useState('');

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useVoice({
    onTranscript: text => {
      if (disabled) return;

      setMessage(text);
      onSend(text);
    },
  });

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height =
      '0px';

    textareaRef.current.style.height =
      `${textareaRef.current.scrollHeight}px`;
  }, [message]);

  useEffect(() => {
    if (!transcript) return;

    setMessage(transcript);
  }, [transcript]);

  function send() {
    const value = message.trim();

    if (!value || disabled) return;

    onSend(value);

    setMessage('');

    textareaRef.current?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();

      send();
    }
  }

  function handleVoice() {
    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  }

  return (
    <div
      className="
        mt-8
        flex
        w-full
        max-w-3xl
        items-end
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
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        disabled={disabled}
        onChange={e =>
          setMessage(e.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={
          isListening
            ? 'Estou ouvindo...'
            : 'Pergunte qualquer coisa...'
        }
        className="
          max-h-40
          flex-1
          resize-none
          overflow-y-auto
          bg-transparent
          text-white
          outline-none
          placeholder:text-slate-500
        "
      />

      <button
        type="button"
        onClick={handleVoice}
        disabled={disabled}
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          text-white
          transition-all

          disabled:cursor-not-allowed
          disabled:opacity-50

          hover:scale-105

          ${
            isListening
              ? 'bg-red-600 hover:bg-red-500'
              : 'bg-blue-600 hover:bg-blue-500'
          }
        `}
      >
        {isListening ? (
          <MicOff size={18} />
        ) : (
          <Mic size={18} />
        )}
      </button>

      <button
        type="button"
        onClick={send}
        disabled={
          disabled ||
          !message.trim()
        }
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

          disabled:cursor-not-allowed
          disabled:opacity-50

          hover:scale-105
          hover:bg-blue-500
        "
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  );
}
