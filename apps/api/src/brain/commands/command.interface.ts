export interface Command {
  matches(message: string): boolean;

  execute(
    conversationId: string,
  ): Promise<{ response: string }>;
}
