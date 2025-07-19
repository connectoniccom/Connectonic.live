import type { Message } from '@/lib/types';
import ChatMessage from './chat-message';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-start gap-3 animate-pulse">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-1/4 bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
          </div>
        </div>
      )}
    </div>
  );
}
