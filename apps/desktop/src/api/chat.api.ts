import { API_URL } from '../config/api';
import { http } from '../lib/http';

interface ChatRequest {
  message: string;
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
): Promise<void> {
  const response = await fetch(
    `${API_URL}/conversation/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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