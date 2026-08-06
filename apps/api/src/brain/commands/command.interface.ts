export interface Command {
  matches(message: string): boolean;

  execute(message: string): Promise<{ response: string }>;
}