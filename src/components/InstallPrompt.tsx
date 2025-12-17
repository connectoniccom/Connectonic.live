
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const { promptEvent, triggerInstall } = useInstallPrompt();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (promptEvent) {
      setIsVisible(true);
    }
  }, [promptEvent]);

  const handleInstallClick = () => {
    triggerInstall();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md">
      <div className="bg-secondary text-secondary-foreground rounded-lg shadow-2xl p-4 flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-4">
          <Download className="h-8 w-8 text-primary" />
          <div>
            <p className="font-semibold">Install Connectonic App</p>
            <p className="text-sm text-muted-foreground">Add to home screen for a better experience.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleInstallClick} size="sm" className="bg-primary hover:bg-primary/90">
            Install
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDismiss}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
