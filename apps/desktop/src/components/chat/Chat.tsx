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
    conversationId,
    conversations,
    orbState,
    isTyping,
    streamingMessageId,
    sendMessage,
    stopGeneration,
    regenerateMessage,
    editMessage,
    newConversation,
    selectConversation,
  } = useChat();

  const hasMessages =
    messages.length > 0;

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
          <select
            value={conversationId ?? ''}
            onChange={(event) => void selectConversation(event.target.value)}
            disabled={isTyping || conversations.length === 0}
            className="max-w-56 rounded-lg border border-blue-500/20 bg-[#070B14] px-2 py-1 text-sm text-white/80"
          >
            {!conversationId && <option value="">Nova conversa</option>}
            {conversations.map((conversation) => (
              <option key={conversation.id} value={conversation.id}>
                {conversation.preview?.slice(0, 28) || 'Nova conversa'}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void newConversation()}
            disabled={isTyping}
            className="rounded-lg border border-blue-500/20 px-3 py-1 text-sm text-blue-200 disabled:opacity-50"
          >
            Nova
          </button>
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
                  onClick={() =>
                    sendMessage(suggestion)
                  }
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
          <>
            {isTyping && (
              <div className="flex justify-center py-4">
                <button
                  onClick={stopGeneration}
                  className="
                    rounded-xl
                    bg-red-600
                    px-5
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition-all

                    hover:bg-red-500
                  "
                >
                  ■ Parar geração
                </button>
              </div>
            )}

            <ChatMessages
              messages={messages}
              isTyping={isTyping}
              streamingMessageId={
                streamingMessageId
              }
              onRegenerate={
                regenerateMessage
              }
              onEdit={editMessage}
            />
          </>
        )}
      </main>

      {/* Input */}
      <footer className="py-6">
        <ChatInput
          onSend={sendMessage}
          disabled={isTyping}
        />
      </footer>
    </section>
  );
}
