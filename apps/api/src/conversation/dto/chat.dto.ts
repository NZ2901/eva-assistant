import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export const CHAT_OPERATIONS = [
  'new',
  'edit',
  'regenerate',
] as const;

export type ChatOperation =
  (typeof CHAT_OPERATIONS)[number];

export class ChatDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsUUID()
  userMessageId?: string;

  @IsOptional()
  @IsUUID()
  assistantMessageId?: string;

  @IsOptional()
  @IsIn(CHAT_OPERATIONS)
  operation?: ChatOperation;
}
