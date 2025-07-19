'use client';

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import ChatLayout from '@/components/chat/chat-layout';
import type { ExpertiseLevel } from '@/lib/types';

export default function Home() {
  const [expertiseLevel, setExpertiseLevel] = useState<ExpertiseLevel>('novice');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-sidebar">
        <Sidebar>
          <AppSidebar
            expertiseLevel={expertiseLevel}
            onExpertiseChange={setExpertiseLevel}
            uploadedFiles={uploadedFiles}
            onFilesChange={setUploadedFiles}
          />
        </Sidebar>
      </div>
      <SidebarInset>
        <ChatLayout
          expertiseLevel={expertiseLevel}
          uploadedFiles={uploadedFiles}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
