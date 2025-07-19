import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, LoaderCircle } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: (e?: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ChatInput({
  input,
  onInputChange,
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <form onSubmit={onSendMessage} className="relative">
      <Textarea
        placeholder="Ask a technical question..."
        value={input}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="pr-20 min-h-[4rem] text-base"
        rows={1}
        aria-label="Chat input"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
        disabled={isLoading || !input.trim()}
        aria-label="Send message"
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Send />
        )}
      </Button>
    </form>
  );
}
