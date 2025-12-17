import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, User, X, Calculator, Heart, LogIn, Smile, Share2, MessageSquare, LogOut, Brain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/artists', icon: User, label: 'Artists' },
    { href: '/animations', icon: Smile, label: 'Animations' },
    { href: '/calculator', icon: Calculator, label: 'Calculator' },
    { href: '/ai', icon: Brain, label: 'AI' },
    { href: '/flutter', icon: Share2, label: 'Connectonic' },
    { href: '/donate', icon: Heart, label: 'Donate' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/youtube', icon: Share2, label: 'YouTube' },
  ];

  return (
    <>
      {isMounted && (
        <>
          {/* Overlay */}
          <div
            className={cn(
              'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden',
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={onClose}
          />

          {/* Sidebar */}
          <aside
            className={cn(
              'fixed top-0 left-0 h-full w-64 bg-card border-r p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0',
              isOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Connectonic</h2>
                <button onClick={onClose} className="md:hidden p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-accent"
                    onClick={onClose}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-accent w-full"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-accent"
                    onClick={onClose}
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;