import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import CodeBlock from './code-block';
import MermaidDiagram from './mermaid-diagram';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-in fade-in',
        !isAssistant && 'flex-row-reverse'
      )}
    >
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className={cn(
          isAssistant ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent-foreground',
          'dark:bg-primary/20 dark:text-primary-foreground'
          )}>
          {isAssistant ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
          'p-3 rounded-lg max-w-2xl text-sm shadow-sm space-y-4', 
          isAssistant ? 'bg-secondary' : 'bg-primary text-primary-foreground'
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {message.diagram && (
          <div className="p-2 bg-background rounded-md">
            <MermaidDiagram chart={message.diagram} />
          </div>
        )}

        {message.codeExamples && message.codeExamples.length > 0 && (
          <div className="space-y-2">
            {message.codeExamples.map((example, index) => (
              <CodeBlock key={index} language={example.language} code={example.code} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
