import { useChat } from '../../hooks/useChat';
import { Orb } from '../orb';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';

const suggestions = [
  'Criar API NestJS',
  'Explicar Prisma',
  'Criar workflow n8n',
  'Revisar código',
];

export function Chat() {
  const {
    messages,
    orbState,
    isTyping,
    streamingMessageId,
    sendMessage,
    stopGeneration,
  } = useChat();

  const hasMessages = messages.length > 0;

  return (
    <section
      className="
        mx-auto
        flex
        h-full
        w-full
        max-w-6xl
        flex-col
      "
    >
      {/* Header */}
      <header
        className="
          flex
          items-center
          justify-between
          border-b
          border-blue-500/10
          py-6
        "
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            EVA Chat
          </h1>

          <p className="mt-1 text-sm text-blue-300/60">
            Converse naturalmente com sua assistente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-sm text-emerald-400">
            Online
          </span>
        </div>
      </header>

      {/* Conteúdo */}
      <main
        className="
          flex
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {!hasMessages ? (
          <div
            className="
              flex
              flex-1
              flex-col
              items-center
              justify-center
            "
          >
            <Orb state={orbState} />

            <h2 className="mt-10 text-4xl font-bold text-white">
              Como posso ajudar hoje?
            </h2>

            <p className="mt-4 max-w-2xl text-center text-lg text-white/60">
              Pergunte qualquer coisa, gere código,
              automatize processos ou converse
              naturalmente com a EVA.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  disabled={isTyping}
                  className="
                    rounded-2xl
                    border
                    border-blue-500/20
                    bg-blue-500/5
                    px-6
                    py-3
                    text-white/80
                    transition-all
                    duration-300

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    hover:-translate-y-1
                    hover:border-blue-400/40
                    hover:bg-blue-500/10
                    hover:text-white
                  "
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            streamingMessageId={streamingMessageId}
          />
        )}
      </main>

      {/* Input */}
      <footer className="py-6">
        <ChatInput
          onSend={sendMessage}
          onStop={stopGeneration}
          disabled={isTyping}
        />
      </footer>
    </section>
  );
}