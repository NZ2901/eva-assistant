import { API_URL } from '../config/api';
import { http } from '../lib/http';

export type ChatOperation =
  | 'new'
  | 'edit'
  | 'regenerate';

export interface ChatRequest {
  message: string;
  conversationId: string;
  userMessageId: string;
  assistantMessageId: string;
  operation: ChatOperation;
}

export interface ConversationSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  preview: string | null;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ConversationDetails extends ConversationSummary {
  messages: ConversationMessage[];
}

interface ChatResponse {
  message: string;
}

export async function sendMessage(
  body: ChatRequest,
): Promise<ChatResponse> {
  const { data } = await http.post<ChatResponse>(
    '/conversation',
    body,
  );

  return data;
}

export async function streamMessage(
  body: ChatRequest,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/conversation/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    },
  );

  if (!response.ok) {
    throw new Error('Erro ao iniciar o streaming.');
  }

  if (!response.body) {
    throw new Error('Streaming não disponível.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } =
      await reader.read();

    if (done) {
      break;
    }

    onChunk(
      decoder.decode(value, {
        stream: true,
      }),
    );
  }
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const { data } = await http.get<ConversationSummary[]>('/conversation');
  return data;
}

export async function createConversation(): Promise<ConversationDetails> {
  const { data } = await http.post<ConversationDetails>('/conversation/new');
  return data;
}

export async function getConversation(
  conversationId: string,
): Promise<ConversationDetails> {
  const { data } = await http.get<ConversationDetails>(
    `/conversation/${conversationId}`,
  );
  return data;
}
