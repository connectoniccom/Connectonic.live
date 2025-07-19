import type { FC } from 'react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, X, BrainCircuit, Bot } from 'lucide-react';
import type { ExpertiseLevel } from '@/lib/types';
import Logo from './icons/logo';

interface AppSidebarProps {
  expertiseLevel: ExpertiseLevel;
  onExpertiseChange: (level: ExpertiseLevel) => void;
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
}

const AppSidebar: FC<AppSidebarProps> = ({ expertiseLevel, onExpertiseChange, uploadedFiles, onFilesChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const uniqueNewFiles = newFiles.filter(
        (file) => !uploadedFiles.some((existingFile) => existingFile.name === file.name)
      );
      onFilesChange([...uploadedFiles, ...uniqueNewFiles]);
      event.target.value = ''; // Reset file input
    }
  };

  const removeFile = (indexToRemove: number) => {
    onFilesChange(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 text-sidebar-primary" />
          <h1 className="text-xl font-headline font-semibold">Matic AI</h1>
        </div>
        <p className="text-sm text-sidebar-foreground/70">
          Your unified tech AI assistant for any query.
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2">
            <BrainCircuit />
            <span>Expertise Level</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <RadioGroup
              value={expertiseLevel}
              onValueChange={(value: ExpertiseLevel) => onExpertiseChange(value)}
              className="mt-2 space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="novice" id="novice" />
                <Label htmlFor="novice" className="cursor-pointer">Novice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expert" id="expert" />
                <Label htmlFor="expert" className="cursor-pointer">Expert</Label>
              </div>
            </RadioGroup>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="gap-2">
            <Paperclip />
            <span>Knowledge Base</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <p className="text-xs text-sidebar-foreground/70 mb-2">
              Upload documentation for customized AI assistance.
            </p>
              <Button asChild variant="outline" className="w-full bg-sidebar-background text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Upload Files
                </label>
              </Button>
              <Input id="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-sidebar-accent p-2 rounded-md animate-in fade-in">
                  <span className="truncate w-40" title={file.name}>{file.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
          <Bot className="h-4 w-4" />
          <span>Powered by Google AI</span>
        </div>
      </SidebarFooter>
    </>
  );
};

export default AppSidebar;
