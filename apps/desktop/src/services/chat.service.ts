import {
  sendMessage,
  streamMessage,
} from '../api/chat.api';

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  message: string;
}

export class ChatService {
  async sendMessage({
    message,
  }: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await sendMessage({
      message,
    });

    return {
      message: response.message,
    };
  }

  async streamMessage(
    { message }: SendMessageRequest,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    await streamMessage(
      {
        message,
      },
      onChunk,
    );
  }
}

export const chatService = new ChatService();