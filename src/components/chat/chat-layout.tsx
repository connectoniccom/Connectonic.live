'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitQuery } from '@/app/actions';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import type { ExpertiseLevel, Message } from '@/lib/types';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface ChatLayoutProps {
  expertiseLevel: ExpertiseLevel;
  uploadedFiles: File[];
}

const initialMessage: Message = {
    id: 'initial',
    role: 'assistant',
    content: "Welcome to Matic AI! I'm here to help with your technical questions. Ask me about anything from code snippets to system design. How can I assist you today?",
};

export default function ChatLayout({ expertiseLevel, uploadedFiles }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const result = await submitQuery({
        query: currentInput,
        expertiseLevel,
        uploadedDocuments: uploadedFiles.map((file) => file.name),
      });

      const assistantMessage: Message = {
        id: Date.now().toString() + 'ai',
        role: 'assistant',
        content: result.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get a response from the AI. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full bg-background relative">
       <header className="flex items-center p-4 border-b">
        <SidebarTrigger className="md:hidden" />
        <h2 className="text-lg font-headline font-semibold ml-2">Matic AI Chat</h2>
      </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={chatContainerRef}>
            <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
        <div className="p-4 md:p-6 border-t bg-background/80 backdrop-blur-sm">
            <ChatInput
                input={input}
                onInputChange={(e) => setInput(e.target.value)}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        </div>
    </div>
  );
}
