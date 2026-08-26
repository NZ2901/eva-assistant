import {
  sendMessage,
  streamMessage,
} from '../api/chat.api';
import type { ChatOperation } from '../api/chat.api';

export interface SendMessageRequest {
  message: string;
  conversationId: string;
  userMessageId: string;
  assistantMessageId: string;
  operation: ChatOperation;
}

export interface SendMessageResponse {
  message: string;
}

export class ChatService {
  async sendMessage({
    message,
    conversationId,
    userMessageId,
    assistantMessageId,
    operation,
  }: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await sendMessage({
      message,
      conversationId,
      userMessageId,
      assistantMessageId,
      operation,
    });

    return {
      message: response.message,
    };
  }

  async streamMessage(
    {
      message,
      conversationId,
      userMessageId,
      assistantMessageId,
      operation,
    }: SendMessageRequest,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    await streamMessage(
      {
        message,
        conversationId,
        userMessageId,
        assistantMessageId,
        operation,
      },
      onChunk,
      signal,
    );
  }
}

export const chatService = new ChatService();
