import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
          'p-3 rounded-lg max-w-xl text-sm whitespace-pre-wrap shadow-sm', 
          isAssistant ? 'bg-secondary' : 'bg-primary text-primary-foreground'
      )}>
        {message.content}
      </div>
    </div>
  );
}
