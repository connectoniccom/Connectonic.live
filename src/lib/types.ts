export type ExpertiseLevel = 'novice' | 'expert';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
