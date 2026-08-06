export type MessageRole = 'user' | 'assistant';

export interface MessageModel {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}