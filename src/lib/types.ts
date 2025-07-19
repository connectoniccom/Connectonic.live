export type ExpertiseLevel = 'novice' | 'expert';

export interface CodeExample {
    language: string;
    code: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeExamples?: CodeExample[];
  diagram?: string;
}
