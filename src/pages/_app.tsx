import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from 'next-themes';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // This is a simple check to prevent the app from running if the secret key is not set.
  // Anyone who clones the repository will not know this key, and the app will appear broken.
  if (process.env.NEXT_PUBLIC_APP_SECRET_KEY !== "YOUR_SECRET_KEY_HERE") {
    return <div />; // Render a completely empty div, resulting in a blank page
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="flex h-screen bg-background">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex flex-col flex-1">
            <Header onMenuClick={toggleSidebar} />
            <main className="flex-1 overflow-y-auto">
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}