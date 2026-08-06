export interface AIMemory {
  key: string;
  value: string;
}

export interface AIAction {
  name: string;
  parameters?: Record<string, unknown>;
}

export interface AIResponse {
  response: string;
  memories: AIMemory[];
  actions: AIAction[];
}